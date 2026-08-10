import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const [slug, summaryArgument] = process.argv.slice(2);

if (!slug || !summaryArgument) {
  console.error('Usage: npm run content:import-summary -- <project-slug> <summary.md>');
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('Invalid project slug.');
  process.exit(1);
}

const projectPath = join(root, 'src/content/projects', `${slug}.md`);
const summaryPath = resolve(process.cwd(), summaryArgument);
const [projectSource, summarySource] = await Promise.all([
  readFile(projectPath, 'utf8'),
  readFile(summaryPath, 'utf8'),
]);

const frontmatterMatch = projectSource.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
if (!frontmatterMatch) {
  console.error(`Could not find valid frontmatter in ${projectPath}`);
  process.exit(1);
}

const roman = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
const normalizedSummary = summarySource
  .replace(/^\uFEFF/, '')
  .replace(/^#\s+[^\n]+\n+/, '')
  .replace(/^##\s+([1-8])\.\s+/gm, (_, index) => `## ${roman[Number(index)]}. `)
  .replace(/\n?\(END\)\s*$/m, '')
  .trim();

if (!/^##\s+/m.test(normalizedSummary)) {
  console.error(`No level-two summary sections were found in ${summaryPath}`);
  process.exit(1);
}

const backupDirectory = join(root, 'tmp/content-backups');
const backupPath = join(
  backupDirectory,
  `${slug}-${new Date().toISOString().replace(/[:.]/g, '-')}.md`,
);
await mkdir(backupDirectory, { recursive: true });
await copyFile(projectPath, backupPath);
await writeFile(projectPath, `${frontmatterMatch[0]}\n${normalizedSummary}\n`, 'utf8');

console.log(`Imported ${basename(summaryPath)} into ${projectPath}`);
console.log(`Previous project content backed up to ${backupPath}`);
console.log('Run npm run check, then review the project page locally.');
