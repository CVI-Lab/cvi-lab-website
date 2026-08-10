import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = fileURLToPath(new URL('..', import.meta.url));
const [type, slug] = process.argv.slice(2);
const types = {
  project: {
    template: 'templates/content/project.md',
    target: (id) => `src/content/projects/${id}.md`,
  },
  publication: {
    template: 'templates/content/publication.yaml',
    target: (id) => `src/content/publications/${id}.yaml`,
  },
  person: {
    template: 'templates/content/person.yaml',
    target: (id) => `src/content/people/${id}.yaml`,
  },
};

if (!type || !slug || !(type in types)) {
  console.error('Usage: npm run content:new -- <project|publication|person> <file-slug>');
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('The file slug may contain lowercase letters, numbers, and single hyphens only.');
  process.exit(1);
}

const definition = types[type];
const templatePath = join(root, definition.template);
const targetPath = join(root, definition.target(slug));

try {
  await access(targetPath, constants.F_OK);
  console.error(`Refusing to overwrite existing content: ${targetPath}`);
  process.exit(1);
} catch {
  // The target does not exist, so it is safe to create.
}

await mkdir(dirname(targetPath), { recursive: true });
let source = await readFile(templatePath, 'utf8');
const parseSource = (value) => type === 'project'
  ? parse(value.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '')
  : parse(value);
const templateData = parseSource(source);
const extension = extname(targetPath);
const existingFiles = (await readdir(dirname(targetPath), { withFileTypes: true }))
  .filter((entry) => entry.isFile() && extname(entry.name) === extension);
let maximumOrder = 0;
for (const entry of existingFiles) {
  const existingSource = await readFile(join(dirname(targetPath), entry.name), 'utf8');
  const data = parseSource(existingSource);
  const inScope = type === 'publication'
    ? data.year === templateData.year
    : type === 'person'
      ? data.status === templateData.status && data.category === templateData.category
      : true;
  if (inScope) maximumOrder = Math.max(maximumOrder, Number(data.order) || 0);
}
source = source.replace(/^order:\s*\d+\s*$/m, `order: ${maximumOrder + 1}`);
await writeFile(targetPath, source, { encoding: 'utf8', flag: 'wx' });

console.log(`Created ${targetPath}`);
console.log('The new entry is ordered first in its page group. Edit it, remove unused optional fields, then run: npm run check');
