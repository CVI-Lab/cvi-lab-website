import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import {
  access,
  copyFile,
  lstat,
  mkdir,
  readFile,
  readlink,
  readdir,
  rename,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { createServer, request as httpRequest } from 'node:http';
import { connect as connectSocket } from 'node:net';
import { tmpdir } from 'node:os';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, stringify } from 'yaml';

const root = fileURLToPath(new URL('..', import.meta.url));

function getCommandOption(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${name} requires a value.`);
  return value;
}

const editorHost = '127.0.0.1';
const editorPort = Number(getCommandOption('--port') ?? process.env.CONTENT_EDITOR_PORT ?? 44321);
if (!Number.isInteger(editorPort) || editorPort < 1 || editorPort > 65535) {
  throw new Error('--port must be a whole number between 1 and 65535.');
}
const requestedAstroPort = Number(process.env.CONTENT_EDITOR_ASTRO_PORT || 44322);
const editorOrigin = `http://${editorHost}:${editorPort}`;
const localBrowserOrigin = `http://localhost:${editorPort}`;
const maxRequestBytes = 2 * 1024 * 1024;

function normalizeEditorBase(value) {
  const candidate = String(value ?? '').trim();
  if (!candidate || candidate === '/') return '';
  const normalized = `/${candidate.replace(/^\/+|\/+$/g, '')}`;
  if (!/^\/[a-zA-Z0-9._~-]+(?:\/[a-zA-Z0-9._~-]+)*$/.test(normalized)) {
    throw new Error('CONTENT_EDITOR_BASE must contain only URL-safe path segments.');
  }
  return normalized;
}

function normalizePublicOrigin(value) {
  if (!value) return undefined;
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('CONTENT_EDITOR_PUBLIC_ORIGIN must be an HTTP(S) origin.');
  }
  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error('CONTENT_EDITOR_PUBLIC_ORIGIN must not contain a path, query, or fragment.');
  }
  return url.origin;
}

const editorBase = normalizeEditorBase(getCommandOption('--base') ?? process.env.CONTENT_EDITOR_BASE);
const remoteOrigin = normalizePublicOrigin(
  getCommandOption('--public-origin') ?? process.env.CONTENT_EDITOR_PUBLIC_ORIGIN,
);
const displayedOrigin = remoteOrigin ?? localBrowserOrigin;
const displayedEditorUrl = `${displayedOrigin}${editorBase}/`;
const localEditorUrl = `${localBrowserOrigin}${editorBase}/`;
const allowedMutationOrigins = new Set([
  editorOrigin,
  localBrowserOrigin,
  remoteOrigin,
].filter(Boolean));

function pathWithinEditorBase(pathname) {
  if (!editorBase) return pathname;
  if (pathname === editorBase) return '/';
  if (pathname.startsWith(`${editorBase}/`)) return pathname.slice(editorBase.length);
  return undefined;
}

function prefixDevelopmentUrls(source) {
  if (!editorBase) return source;
  const developmentRoots = ['@vite', '@id', '@fs', 'node_modules', 'src'];
  let output = source;
  for (const quote of ['"', "'", '`']) {
    for (const rootName of developmentRoots) {
      output = output.replaceAll(
        `${quote}/${rootName}/`,
        `${quote}${editorBase}/${rootName}/`,
      );
    }
  }
  for (const rootName of developmentRoots) {
    output = output.replaceAll(
      `url(/${rootName}/`,
      `url(${editorBase}/${rootName}/`,
    );
  }
  const baseWithSlash = `${editorBase}/`;
  output = output
    .replaceAll('const base$1 = "/" || "/";', `const base$1 = "${baseWithSlash}" || "/";`)
    .replaceAll('const base = "/" || "/";', `const base = "${baseWithSlash}" || "/";`);
  return output;
}

function findAvailablePort(preferredPort) {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.unref();
    probe.once('error', (error) => {
      if (error.code !== 'EADDRINUSE') {
        reject(error);
        return;
      }
      const fallback = createServer();
      fallback.unref();
      fallback.once('error', reject);
      fallback.listen(0, editorHost, () => {
        const address = fallback.address();
        fallback.close(() => resolve(address.port));
      });
    });
    probe.listen(preferredPort, editorHost, () => {
      probe.close(() => resolve(preferredPort));
    });
  });
}

const astroPort = await findAvailablePort(requestedAstroPort);

const workspaceKey = createHash('sha256').update(root).digest('hex').slice(0, 12);
const editorRuntimeRoot = join(
  tmpdir(),
  'cvi-lab-content-editor',
  workspaceKey,
  String(editorPort),
);

async function ensureRuntimeLink(name, type) {
  const source = join(root, name);
  const destination = join(editorRuntimeRoot, name);
  try {
    await symlink(source, destination, type);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    const stats = await lstat(destination);
    const target = stats.isSymbolicLink() ? await readlink(destination) : undefined;
    if (!stats.isSymbolicLink() || target !== source) {
      throw new Error(`Editor runtime path already exists and is not the expected link: ${destination}`);
    }
  }
}

async function prepareEditorRuntime() {
  await mkdir(editorRuntimeRoot, { recursive: true });
  await Promise.all([
    ensureRuntimeLink('astro.config.mjs', 'file'),
    ensureRuntimeLink('package.json', 'file'),
    ensureRuntimeLink('tsconfig.json', 'file'),
    ensureRuntimeLink('src', process.platform === 'win32' ? 'junction' : 'dir'),
    ensureRuntimeLink('public', process.platform === 'win32' ? 'junction' : 'dir'),
    ensureRuntimeLink('node_modules', process.platform === 'win32' ? 'junction' : 'dir'),
  ]);
}

await prepareEditorRuntime();

const types = {
  project: {
    directory: join(root, 'src/content/projects'),
    extension: '.md',
    template: join(root, 'templates/content/project.md'),
  },
  publication: {
    directory: join(root, 'src/content/publications'),
    extension: '.yaml',
    template: join(root, 'templates/content/publication.yaml'),
  },
  person: {
    directory: join(root, 'src/content/people'),
    extension: '.yaml',
    template: join(root, 'templates/content/person.yaml'),
  },
};

const editableDocuments = {
  site: join(root, 'src/data/site.json'),
  research: join(root, 'src/data/research.json'),
  join: join(root, 'src/data/join.json'),
  pages: join(root, 'src/data/page-copy.json'),
};

function parseCopyKey(key) {
  const match = String(key ?? '').match(/^([a-z]+):([a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*)$/);
  if (!match || !editableDocuments[match[1]]) throw new Error('Invalid editable text key.');
  const [, documentName, pathSource] = match;
  if (documentName === 'site' && pathSource === 'domain') {
    throw new Error('The deployment domain is not editable from page copy controls.');
  }
  if (documentName === 'research' && !/^\d+\.(?:name|shortDescription|extendedDescription|topics)$/.test(pathSource)) {
    throw new Error('That research-area field is not editable text.');
  }
  return {
    documentName,
    filePath: editableDocuments[documentName],
    segments: pathSource.split('.'),
  };
}

function resolveCopyValue(document, segments) {
  let parent = document;
  for (const segment of segments.slice(0, -1)) {
    if (!parent || typeof parent !== 'object' || !(segment in parent)) {
      throw new Error('Editable text field does not exist.');
    }
    parent = parent[segment];
  }
  const field = segments.at(-1);
  if (!parent || typeof parent !== 'object' || !(field in parent)) {
    throw new Error('Editable text field does not exist.');
  }
  return { parent, field, value: parent[field] };
}

async function readCopy(key) {
  const definition = parseCopyKey(key);
  const document = JSON.parse(await readFile(definition.filePath, 'utf8'));
  const { value } = resolveCopyValue(document, definition.segments);
  if (typeof value === 'string') {
    return { key, value, format: 'text', sourcePath: relative(root, definition.filePath) };
  }
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    return { key, value: value.join('\n'), format: 'lines', sourcePath: relative(root, definition.filePath) };
  }
  throw new Error('This field is structured content and cannot be edited as text.');
}

async function saveCopy(key, inputValue) {
  if (typeof inputValue !== 'string') throw new Error('Editable text must be a string.');
  const definition = parseCopyKey(key);
  const document = JSON.parse(await readFile(definition.filePath, 'utf8'));
  const target = resolveCopyValue(document, definition.segments);
  const trimmed = inputValue.trim();
  if (!trimmed) throw new Error('Editable text cannot be empty.');
  if (trimmed.length > 50000) throw new Error('Editable text is too long.');

  if (typeof target.value === 'string') {
    target.parent[target.field] = trimmed;
  } else if (Array.isArray(target.value) && target.value.every((item) => typeof item === 'string')) {
    const values = trimmed.split('\n').map((value) => value.trim()).filter(Boolean);
    if (values.length === 0) throw new Error('Add at least one line.');
    target.parent[target.field] = values;
  } else {
    throw new Error('This field is structured content and cannot be edited as text.');
  }

  const backupDirectory = join(root, 'tmp/content-backups/editor/text');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = join(backupDirectory, `${definition.documentName}-${timestamp}.json`);
  await mkdir(backupDirectory, { recursive: true });
  await copyFile(definition.filePath, backupPath);

  const temporaryPath = `${definition.filePath}.tmp-${process.pid}-${Date.now()}`;
  await writeFile(temporaryPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
  await rename(temporaryPath, definition.filePath);
  return relative(root, backupPath);
}

const isValidId = (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value ?? '');
const getDefinition = (type) => types[type];
const getItemPath = (type, id) => {
  const definition = getDefinition(type);
  if (!definition || !isValidId(id)) return undefined;
  return join(definition.directory, `${id}${definition.extension}`);
};

function splitProjectSource(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error('Project file is missing valid YAML frontmatter.');
  return {
    data: parse(match[1]) ?? {},
    body: source.slice(match[0].length).replace(/^\s+/, ''),
  };
}

async function readItem(type, id) {
  const filePath = getItemPath(type, id);
  if (!filePath) throw new Error('Invalid content type or item ID.');
  const source = await readFile(filePath, 'utf8');
  const parsed = type === 'project'
    ? splitProjectSource(source)
    : { data: parse(source) ?? {}, body: undefined };
  return {
    type,
    id,
    sourcePath: relative(root, filePath),
    ...parsed,
  };
}

async function listItems(type) {
  const definition = getDefinition(type);
  if (!definition) throw new Error('Invalid content type.');
  const files = await readdir(definition.directory, { withFileTypes: true });
  const items = await Promise.all(files
    .filter((entry) => entry.isFile() && extname(entry.name) === definition.extension)
    .map(async (entry) => {
      const id = entry.name.slice(0, -definition.extension.length);
      const item = await readItem(type, id);
      return {
        id,
        title: item.data.title ?? item.data.name ?? id,
        year: item.data.year,
        status: item.data.status,
        category: item.data.category,
        order: item.data.order ?? 100,
      };
    }));

  return items.sort((a, b) => {
    if (type === 'publication') return (b.year ?? 0) - (a.year ?? 0) || b.order - a.order;
    if (type === 'person') {
      const statusRank = { current: 0, alumni: 1 };
      const categoryRank = { pi: 0, postdoc: 1, phd: 2, masters: 3, undergraduate: 4 };
      return (statusRank[a.status] ?? 2) - (statusRank[b.status] ?? 2)
        || (categoryRank[a.category] ?? 5) - (categoryRank[b.category] ?? 5)
        || b.order - a.order
        || a.title.localeCompare(b.title);
    }
    return b.order - a.order || a.title.localeCompare(b.title);
  });
}

const requireText = (data, field, label = field) => {
  if (typeof data[field] !== 'string' || !data[field].trim()) {
    throw new Error(`${label} is required.`);
  }
};

async function validateItem(type, data, body) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Content data must be an object.');
  }

  if (type === 'project') {
    for (const field of ['title', 'subtitle', 'summary', 'publication']) requireText(data, field);
    if (!data.image || typeof data.image !== 'object') throw new Error('Project image details are required.');
    for (const field of ['src', 'alt', 'caption']) requireText(data.image, field, `image.${field}`);
    if (!Array.isArray(data.tags) || data.tags.length === 0) throw new Error('At least one project tag is required.');
    if (typeof body !== 'string' || !/^##\s+/m.test(body)) {
      throw new Error('Project detail Markdown must contain at least one level-two heading (## Heading).');
    }
    const publicationPath = getItemPath('publication', data.publication);
    if (!publicationPath) throw new Error('The linked publication ID is invalid.');
    try {
      await access(publicationPath, constants.F_OK);
    } catch {
      throw new Error(`Linked publication "${data.publication}" does not exist.`);
    }
  } else if (type === 'publication') {
    for (const field of ['title', 'venue', 'bibtex']) requireText(data, field);
    if (!Array.isArray(data.authors) || data.authors.length === 0) throw new Error('At least one author is required.');
    if (!Number.isInteger(data.year)) throw new Error('Publication year must be a whole number.');
  } else if (type === 'person') {
    for (const field of ['name', 'role', 'avatar']) requireText(data, field);
    if (!['current', 'alumni'].includes(data.status)) throw new Error('Person status must be current or alumni.');
    if (!['pi', 'postdoc', 'phd', 'masters', 'undergraduate'].includes(data.category)) {
      throw new Error('Person category is invalid.');
    }
  } else {
    throw new Error('Invalid content type.');
  }
}

function serializeItem(type, data, body) {
  const yamlSource = stringify(data, { lineWidth: 0 });
  return type === 'project'
    ? `---\n${yamlSource}---\n\n${body.trim()}\n`
    : yamlSource;
}

async function nextScopedOrder(type, data, excludedId) {
  const items = await listItems(type);
  const matching = items.filter((item) => {
    if (item.id === excludedId) return false;
    if (type === 'publication') return item.year === data.year;
    if (type === 'person') return item.status === data.status && item.category === data.category;
    return true;
  });
  return Math.max(0, ...matching.map((item) => Number(item.order) || 0)) + 1;
}

async function nextFeaturedOrder(excludedId) {
  const projects = await listItems('project');
  let maximum = 0;
  for (const project of projects) {
    if (project.id === excludedId) continue;
    const item = await readItem('project', project.id);
    if (item.data.featured) maximum = Math.max(maximum, Number(item.data.featuredOrder) || 0);
  }
  return maximum + 1;
}

async function saveItem(type, id, data, body) {
  const filePath = getItemPath(type, id);
  if (!filePath) throw new Error('Invalid content type or item ID.');
  const previous = await readItem(type, id);
  if (type === 'publication' && previous.data.year !== data.year) {
    data.order = await nextScopedOrder(type, data, id);
  }
  if (type === 'person'
    && (previous.data.status !== data.status || previous.data.category !== data.category)) {
    data.order = await nextScopedOrder(type, data, id);
  }
  if (type === 'project') {
    if (!data.featured) delete data.featuredOrder;
    else if (!previous.data.featured || !Number.isInteger(data.featuredOrder)) {
      data.featuredOrder = await nextFeaturedOrder(id);
    }
  }
  await validateItem(type, data, body);

  const source = serializeItem(type, data, body);

  const backupDirectory = join(root, 'tmp/content-backups/editor');
  const backupPath = join(
    backupDirectory,
    `${type}-${id}-${new Date().toISOString().replace(/[:.]/g, '-')}${types[type].extension}`,
  );
  await mkdir(backupDirectory, { recursive: true });
  await copyFile(filePath, backupPath);

  const temporaryPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  await writeFile(temporaryPath, source, 'utf8');
  await rename(temporaryPath, filePath);

  return relative(root, backupPath);
}

const humanizeId = (id) => id
  .split('-')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

async function createItem(type, id, seed = {}) {
  const definition = getDefinition(type);
  const filePath = getItemPath(type, id);
  if (!definition || !filePath) throw new Error('Invalid content type or item ID.');
  const input = seed && typeof seed === 'object' && !Array.isArray(seed) ? seed : {};

  const templateSource = await readFile(definition.template, 'utf8');
  const parsed = type === 'project'
    ? splitProjectSource(templateSource)
    : { data: parse(templateSource) ?? {}, body: undefined };

  if (type === 'project') {
    if (!isValidId(input.publication)) {
      throw new Error('A valid linked publication ID is required for a new project.');
    }
    parsed.data.title = typeof input.title === 'string' && input.title.trim()
      ? input.title.trim()
      : humanizeId(id);
    parsed.data.publication = input.publication;
  } else if (type === 'publication') {
    parsed.data.title = typeof input.title === 'string' && input.title.trim()
      ? input.title.trim()
      : humanizeId(id);
    delete parsed.data.project;
  } else {
    parsed.data.name = typeof input.name === 'string' && input.name.trim()
      ? input.name.trim()
      : humanizeId(id);
  }

  parsed.data.order = await nextScopedOrder(type, parsed.data);

  await validateItem(type, parsed.data, parsed.body);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, serializeItem(type, parsed.data, parsed.body), { encoding: 'utf8', flag: 'wx' });
  return readItem(type, id);
}

async function reorderItems(kind, ids) {
  if (!['project', 'featured-project', 'publication', 'person'].includes(kind)) {
    throw new Error('Invalid ordering group.');
  }
  if (!Array.isArray(ids) || ids.length === 0 || ids.some((id) => !isValidId(id))) {
    throw new Error('A non-empty list of valid content IDs is required.');
  }
  if (new Set(ids).size !== ids.length) throw new Error('Ordering IDs must be unique.');

  const type = kind === 'featured-project' ? 'project' : kind;
  const requestedItems = await Promise.all(ids.map((id) => readItem(type, id)));
  const listedItems = await listItems(type);
  let expectedIds;
  let field = 'order';

  if (kind === 'project') {
    expectedIds = listedItems.map((item) => item.id);
  } else if (kind === 'featured-project') {
    field = 'featuredOrder';
    const featured = [];
    for (const item of listedItems) {
      const project = await readItem('project', item.id);
      if (project.data.featured) featured.push(project);
    }
    featured.sort((a, b) => (b.data.featuredOrder ?? 0) - (a.data.featuredOrder ?? 0));
    expectedIds = featured.slice(0, 3).map((item) => item.id);
  } else if (kind === 'publication') {
    const year = requestedItems[0].data.year;
    if (requestedItems.some((item) => item.data.year !== year)) {
      throw new Error('Publications can only be reordered within the same year.');
    }
    expectedIds = listedItems.filter((item) => item.year === year).map((item) => item.id);
  } else {
    const { status, category } = requestedItems[0].data;
    if (requestedItems.some((item) => item.data.status !== status || item.data.category !== category)) {
      throw new Error('People can only be reordered within the same status and category.');
    }
    expectedIds = listedItems
      .filter((item) => item.status === status && item.category === category)
      .map((item) => item.id);
  }

  const requestedSet = new Set(ids);
  if (expectedIds.length !== ids.length || expectedIds.some((id) => !requestedSet.has(id))) {
    throw conflictError('The page ordering is stale because its content set changed. Reload and drag again.');
  }

  let baseOrder = 0;
  if (kind === 'featured-project') {
    const visibleIds = new Set(expectedIds);
    for (const item of listedItems) {
      if (visibleIds.has(item.id)) continue;
      const project = await readItem('project', item.id);
      if (project.data.featured) {
        baseOrder = Math.max(baseOrder, Number(project.data.featuredOrder) || 0);
      }
    }
  }

  const backups = [];
  for (const [index, item] of requestedItems.entries()) {
    const value = baseOrder + ids.length - index;
    if (item.data[field] === value) continue;
    item.data[field] = value;
    backups.push(await saveItem(type, item.id, item.data, item.body));
  }
  return { changed: backups.length, backups };
}

function conflictError(message) {
  const error = new Error(message);
  error.statusCode = 409;
  return error;
}

async function findItemReferences(type, id) {
  if (type === 'publication') {
    const projects = await listItems('project');
    const references = [];
    for (const project of projects) {
      const item = await readItem('project', project.id);
      if (item.data.publication === id) references.push(`project "${item.data.title}" (${project.id})`);
    }
    return references;
  }
  if (type === 'project') {
    const publications = await listItems('publication');
    const references = [];
    for (const publication of publications) {
      const item = await readItem('publication', publication.id);
      if (item.data.project === id) references.push(`publication "${item.data.title}" (${publication.id})`);
    }
    return references;
  }
  return [];
}

async function deleteItem(type, id) {
  const definition = getDefinition(type);
  const filePath = getItemPath(type, id);
  if (!definition || !filePath) throw new Error('Invalid content type or item ID.');
  await access(filePath, constants.F_OK);

  const references = await findItemReferences(type, id);
  if (references.length) {
    throw conflictError(
      `Cannot delete this ${type}; it is still linked from ${references.join(', ')}. Remove that link first.`,
    );
  }

  const backupDirectory = join(root, 'tmp/content-backups/editor/deleted');
  const backupPath = join(
    backupDirectory,
    `${type}-${id}-${new Date().toISOString().replace(/[:.]/g, '-')}${definition.extension}`,
  );
  await mkdir(backupDirectory, { recursive: true });
  await rename(filePath, backupPath);
  return relative(root, backupPath);
}

function sendJson(response, status, value) {
  const body = JSON.stringify(value);
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(body);
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxRequestBytes) throw new Error('Request body is too large.');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

function mutationOriginAllowed(request) {
  const origin = request.headers.origin;
  return !origin || allowedMutationOrigins.has(origin);
}

async function serveEditorAsset(response, filename, contentType) {
  const source = await readFile(join(root, 'scripts/content-editor', filename));
  response.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': source.length,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(source);
}

async function handleEditorRequest(request, response, url, pathname) {
  if (pathname === '/__editor/client.js') {
    await serveEditorAsset(response, 'client.js', 'text/javascript; charset=utf-8');
    return true;
  }
  if (pathname === '/__editor/styles.css') {
    await serveEditorAsset(response, 'styles.css', 'text/css; charset=utf-8');
    return true;
  }
  if (!pathname.startsWith('/__editor/api/')) return false;

  try {
    if (request.method === 'GET' && pathname === '/__editor/api/items') {
      sendJson(response, 200, { items: await listItems(url.searchParams.get('type')) });
      return true;
    }
    if (request.method === 'GET' && pathname === '/__editor/api/item') {
      sendJson(response, 200, await readItem(url.searchParams.get('type'), url.searchParams.get('id')));
      return true;
    }
    if (request.method === 'GET' && pathname === '/__editor/api/copy') {
      sendJson(response, 200, await readCopy(url.searchParams.get('key')));
      return true;
    }
    if (!mutationOriginAllowed(request)) {
      sendJson(response, 403, { error: 'Mutation requests are accepted only from the local editor.' });
      return true;
    }
    if (request.method === 'PUT' && pathname === '/__editor/api/item') {
      const input = await readJson(request);
      const backup = await saveItem(input.type, input.id, input.data, input.body);
      sendJson(response, 200, { ok: true, backup });
      return true;
    }
    if (request.method === 'PUT' && pathname === '/__editor/api/copy') {
      const input = await readJson(request);
      const backup = await saveCopy(input.key, input.value);
      sendJson(response, 200, { ok: true, backup });
      return true;
    }
    if (request.method === 'PUT' && pathname === '/__editor/api/order') {
      const input = await readJson(request);
      sendJson(response, 200, { ok: true, ...await reorderItems(input.kind, input.ids) });
      return true;
    }
    if (request.method === 'POST' && pathname === '/__editor/api/item') {
      const input = await readJson(request);
      sendJson(response, 201, await createItem(input.type, input.id, input.seed));
      return true;
    }
    if (request.method === 'DELETE' && pathname === '/__editor/api/item') {
      const input = await readJson(request);
      const backup = await deleteItem(input.type, input.id);
      sendJson(response, 200, { ok: true, backup });
      return true;
    }
    sendJson(response, 404, { error: 'Editor API endpoint not found.' });
  } catch (error) {
    const code = error?.statusCode
      ?? (error?.code === 'EEXIST' ? 409 : error?.code === 'ENOENT' ? 404 : 400);
    sendJson(response, code, { error: error instanceof Error ? error.message : String(error) });
  }
  return true;
}

function proxyToAstro(request, response) {
  const headers = {
    ...request.headers,
    host: `${editorHost}:${astroPort}`,
    'accept-encoding': 'identity',
    'x-forwarded-host': request.headers.host,
    'x-forwarded-proto': 'http',
  };
  const proxyRequest = httpRequest({
    hostname: editorHost,
    port: astroPort,
    method: request.method,
    path: request.url,
    headers,
  }, (proxyResponse) => {
    const contentType = String(proxyResponse.headers['content-type'] ?? '');
    const isHtml = contentType.includes('text/html');
    const isDevelopmentText = editorBase && (
      contentType.includes('javascript')
      || contentType.includes('text/css')
    );
    if (!isHtml && !isDevelopmentText) {
      response.writeHead(proxyResponse.statusCode ?? 502, proxyResponse.headers);
      proxyResponse.pipe(response);
      return;
    }

    const chunks = [];
    proxyResponse.on('data', (chunk) => chunks.push(chunk));
    proxyResponse.on('end', () => {
      let output = prefixDevelopmentUrls(Buffer.concat(chunks).toString('utf8'));
      if (isHtml) {
        output = output.replace(
          '</head>',
          `<link rel="stylesheet" href="${editorBase}/__editor/styles.css" data-cvi-editor></head>`,
        );
        output = output.replace(
          '</body>',
          `<script type="module" src="${editorBase}/__editor/client.js" data-cvi-editor data-editor-base="${editorBase}"></script></body>`,
        );
      }
      const outputHeaders = { ...proxyResponse.headers };
      delete outputHeaders['content-length'];
      delete outputHeaders['content-encoding'];
      outputHeaders['content-length'] = Buffer.byteLength(output);
      outputHeaders['cache-control'] = 'no-store';
      response.writeHead(proxyResponse.statusCode ?? 200, outputHeaders);
      response.end(output);
    });
  });
  proxyRequest.on('error', () => {
    if (!response.headersSent) {
      response.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8', 'Retry-After': '1' });
    }
    response.end('The Astro development server is starting. Reload this page in a moment.');
  });
  request.pipe(proxyRequest);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', editorOrigin);
  const editorPathname = pathWithinEditorBase(url.pathname);
  if (editorPathname !== undefined && await handleEditorRequest(request, response, url, editorPathname)) return;
  proxyToAstro(request, response);
});

server.on('upgrade', (request, socket, head) => {
  const upstream = connectSocket(astroPort, editorHost, () => {
    const headerLines = [];
    for (let index = 0; index < request.rawHeaders.length; index += 2) {
      if (request.rawHeaders[index].toLowerCase() === 'host') continue;
      headerLines.push(`${request.rawHeaders[index]}: ${request.rawHeaders[index + 1]}`);
    }
    upstream.write(
      `${request.method} ${request.url} HTTP/${request.httpVersion}\r\nHost: ${editorHost}:${astroPort}\r\n${headerLines.join('\r\n')}\r\n\r\n`,
    );
    if (head.length) upstream.write(head);
    socket.pipe(upstream).pipe(socket);
  });
  upstream.on('error', () => socket.destroy());
});

let shuttingDown = false;
const astroBin = join(root, 'node_modules/astro/bin/astro.mjs');
const astroProcess = spawn(
  process.execPath,
  [
    astroBin,
    'dev',
    '--root',
    editorRuntimeRoot,
    '--host',
    editorHost,
    '--port',
    String(astroPort),
  ],
  {
    cwd: editorRuntimeRoot,
    env: {
      ...process.env,
      ASTRO_DEV_BACKGROUND: '0',
      ASTRO_TELEMETRY_DISABLED: '1',
      CONTENT_EDITOR_BASE: editorBase,
      CONTENT_EDITOR_SOURCE_ROOT: root,
      CONTENT_EDITOR_RUNTIME_ROOT: editorRuntimeRoot,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);
astroProcess.stdout.on('data', (chunk) => process.stdout.write(`[astro] ${chunk}`));
astroProcess.stderr.on('data', (chunk) => process.stderr.write(`[astro] ${chunk}`));
astroProcess.on('exit', (code) => {
  if (!shuttingDown) console.error(`Astro development server exited with code ${code}.`);
});

const shutdown = () => {
  if (shuttingDown) return;
  shuttingDown = true;
  astroProcess.kill('SIGTERM');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 1500).unref();
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

server.on('error', (error) => {
  console.error(`Could not start the content editor: ${error.message}`);
  shutdown();
});

server.listen(editorPort, editorHost, () => {
  console.log('\nCVI Lab local content editor');
  console.log(`Open: ${displayedEditorUrl}`);
  if (remoteOrigin) console.log(`Local fallback: ${localEditorUrl}`);
  console.log('This server is bound to localhost and is not part of the production build.');
  console.log('Press Ctrl+C to stop.\n');
});
