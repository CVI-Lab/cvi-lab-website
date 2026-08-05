import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import astroConfig from '../astro.config.mjs';

const distRoot = path.resolve('dist');
const basePath = astroConfig.base && astroConfig.base !== '/'
  ? `/${astroConfig.base.replace(/^\/+|\/+$/g, '')}`
  : '';

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  }));
  return files.flat();
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function pageUrlFor(filePath) {
  const relative = path.relative(distRoot, filePath).split(path.sep).join('/');
  if (relative === 'index.html') return `${basePath}/`;
  if (relative.endsWith('/index.html')) return `${basePath}/${relative.slice(0, -'index.html'.length)}`;
  return `${basePath}/${relative}`;
}

function candidateFor(pathname) {
  let deploymentPath = decodeURIComponent(pathname);
  if (basePath && (deploymentPath === basePath || deploymentPath.startsWith(`${basePath}/`))) {
    deploymentPath = deploymentPath.slice(basePath.length) || '/';
  }

  const relative = deploymentPath.replace(/^\/+/, '');
  if (!relative) return path.join(distRoot, 'index.html');
  if (deploymentPath.endsWith('/')) return path.join(distRoot, relative, 'index.html');
  return path.join(distRoot, relative);
}

const allFiles = await walk(distRoot);
const htmlFiles = allFiles.filter((file) => file.endsWith('.html'));
const errors = [];
let checkedReferences = 0;

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, 'utf8');
  const pageUrl = pageUrlFor(htmlFile);
  const referencePattern = /\b(?:href|src)=(['"])(.*?)\1/g;

  for (const match of html.matchAll(referencePattern)) {
    const rawReference = match[2];
    if (!rawReference || /^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(rawReference)) continue;

    if (basePath && rawReference.startsWith('/') && rawReference !== basePath && !rawReference.startsWith(`${basePath}/`)) {
      errors.push(`${pageUrl}: root-relative reference does not include base ${rawReference}`);
      continue;
    }

    const target = new URL(rawReference, `https://local.test${pageUrl}`);
    const targetFile = candidateFor(target.pathname);
    let resolvedFile = targetFile;

    if (!(await exists(resolvedFile)) && !path.extname(target.pathname)) {
      const directoryIndex = path.join(targetFile, 'index.html');
      if (await exists(directoryIndex)) resolvedFile = directoryIndex;
    }

    checkedReferences += 1;
    if (!(await exists(resolvedFile))) {
      errors.push(`${pageUrl}: missing target ${rawReference}`);
      continue;
    }

    if (target.hash && resolvedFile.endsWith('.html')) {
      const targetHtml = resolvedFile === htmlFile ? html : await readFile(resolvedFile, 'utf8');
      const fragment = decodeURIComponent(target.hash.slice(1));
      const escapedFragment = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const anchorPattern = new RegExp(`(?:id|name)=["']${escapedFragment}["']`);
      if (!anchorPattern.test(targetHtml)) errors.push(`${pageUrl}: missing fragment ${rawReference}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Static link check failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Static link check passed: ${htmlFiles.length} HTML files, ${checkedReferences} internal references.`);
