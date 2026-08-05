# CVI Lab Website

Production-ready static website for the Laboratory for Computational Vision and Intelligence (CVI Lab) at the University of British Columbia, Okanagan Campus.

## Stack

- Astro 7 with TypeScript and static generation
- Local Manrope and Inter variable fonts
- Plain CSS with responsive design tokens
- Small framework-free scripts for navigation, image fallbacks, and BibTeX copying
- Astro sitemap generation
- Static-host-compatible `dist/` output

No backend, database, CMS, runtime content API, or Python environment is required.

## Local setup

Use Node.js 22.12 or newer and npm 9.6.5 or newer.

```bash
npm install
npm run dev
```

Astro serves the development site at `http://localhost:4321/` by default. If that port is unavailable, Astro prints the alternate local URL it selects.

## Commands

```bash
npm run dev          # Start the local development server
npm run check        # Run Astro and TypeScript diagnostics
npm run build        # Type-check, build static output, and audit internal links
npm run check:links  # Check links/assets in an existing dist directory
npm run preview      # Preview the production output locally
npm audit            # Review dependency advisories
```

The build output is written to `dist/`. Telemetry is disabled in npm scripts so builds behave consistently in local sandboxes and CI.

## Project structure

```text
src/
├── components/        Reusable UI components
├── data/              Canonical typed site content
├── layouts/           Shared metadata, header, and footer shell
├── pages/             Static routes, dynamic project routes, and generated robots.txt
└── styles/            Global design system and responsive rules
public/
├── brand/             CVI Lab logo and replaceable brand assets
├── images/            Website imagery, generated portraits, and project placeholders
└── _headers           Cloudflare security/cache headers
scripts/
└── check-links.mjs    Static output link and asset audit
```

## Updating content

- Laboratory identity, metadata, address, email, mission, and shared copy: `src/data/site.ts`
- Navigation: `src/data/navigation.ts`
- Research themes and topic tags: `src/data/research.ts`
- People and alumni: `src/data/people.ts`
- Projects and project-detail content: `src/data/projects.ts`
- Publications and BibTeX: `src/data/publications.ts`
- Recruitment details: `src/data/join.ts`
- Palette, type scale, spacing, and responsive behavior: `src/styles/global.css`

To add a project, add one `Project` record in `src/data/projects.ts`. Its `slug` automatically creates `/projects/[slug]/`. To link a publication to that page, use the same slug in `src/data/publications.ts` and keep the shared publication ID aligned.

Optional links are omitted when their URL is unavailable. Replace placeholder URLs with confirmed values rather than adding `#` links.

## Replacing assets

Public asset paths are stable, so approved files can replace placeholders without component edits:

- `public/brand/ubc-logo-placeholder.svg`
- `public/images/projects/trisim-placeholder.jpg`
- `public/images/projects/cppmn-placeholder.jpg`
- `public/images/social-preview-placeholder.jpg`

The UBC SVG is intentionally a labelled box and does not imitate the official university logo. Replace it only with an officially approved asset.

The raster assets were generated with the built-in image workflow. Generated images must not be represented as documentary photographs or research results. Asset summaries:

- Group-meeting image: a photorealistic synthetic composition informed by approved member reference photographs; it is not a real event photograph.
- PI, member, and alumni portraits: stylized generated likenesses informed by reference photographs; Bill's portrait was generated from a written description.
- TriSim and CPPMN project images: illustrative scientific placeholders for the website, not figures or results from the papers.
- Social preview: text-free scientific collage combining a 3D facial surface, motion trajectories, acoustic signal, remote-sensing tiles, and node lattice.

Confirmed project imagery remains linked to the supplied author project pages and GitHub repositories. `ResponsiveImage.astro` displays a neutral fallback if a remote asset is unavailable.

## Deployment

### Cloudflare Pages

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: 22.12 or newer

The included `public/_headers` file is copied into the deployment output.

The current configuration deploys at the root of `https://cvi-lab.project-aris.io`. No Astro `base` path is configured. Deploy the complete contents of `dist/` at the domain root.

### GitHub Pages

Build with `npm run build` and publish `dist/`. The current root-path configuration works with a GitHub Pages custom domain. A repository site published under `https://<username>.github.io/<repository>/` requires adding `base: '/<repository>'` to `astro.config.mjs` and updating the `_astro` cache path in `public/_headers` before rebuilding.

## Before launch

Confirm that the production domain remains synchronized in both locations:

- `astro.config.mjs`
- `src/data/site.ts`

`robots.txt` is generated by `src/pages/robots.txt.ts`; sitemap files are generated by `@astrojs/sitemap`. Canonical URLs, Open Graph URLs, sitemap URLs, navigation, and asset references use the production domain and configured base. If a base is added later, update `astro.config.mjs` and the matching cache path in `public/_headers`, then rebuild.

Also replace generated people/project placeholders, approved logos, profile links, and the GitHub organization placeholder as official material becomes available.
