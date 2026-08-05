import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { withBase } from '../utils/paths';

export const prerender = true;

export const GET: APIRoute = () => {
  const sitemapUrl = new URL(withBase('/sitemap-index.xml'), site.domain);

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
