import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cvi-lab.project-aris.io',
  output: 'static',
  integrations: [sitemap()],
  build: {
    format: 'directory',
  },
});
