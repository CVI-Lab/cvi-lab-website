import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkBracketMath from './src/utils/remark-bracket-math.mjs';

const editorBase = process.env.CONTENT_EDITOR_BASE;
const editorSourceRoot = process.env.CONTENT_EDITOR_SOURCE_ROOT;
const editorRuntimeRoot = process.env.CONTENT_EDITOR_RUNTIME_ROOT;

export default defineConfig({
  site: 'https://cvi-lab.project-aris.io',
  ...(editorBase ? {
    base: editorBase,
    devToolbar: { enabled: false },
    vite: {
      resolve: { preserveSymlinks: true },
      server: {
        ws: { path: editorBase },
        ...(editorSourceRoot && editorRuntimeRoot ? {
          fs: { allow: [editorSourceRoot, editorRuntimeRoot] },
        } : {}),
      },
    },
  } : {}),
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkBracketMath, [remarkMath, { singleDollarTextMath: true }]],
      rehypePlugins: [rehypeKatex],
    }),
  },
  build: {
    format: 'directory',
  },
});
