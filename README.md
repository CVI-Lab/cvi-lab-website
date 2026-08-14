# CVI Lab Website

Production-ready static website for the Laboratory for Computational Vision and Intelligence (CVI Lab) at the University of British Columbia, Okanagan Campus.

## Stack

- Astro 7 with TypeScript and static generation
- Local Manrope and Inter variable fonts
- Plain CSS with responsive design tokens
- Small framework-free scripts for navigation, image fallbacks, and BibTeX copying
- Astro sitemap generation
- Static-host-compatible `dist/` output

The deployed site needs no backend, database, CMS, runtime content API, or Python environment. A small localhost-only editor server is included for convenient visual content maintenance.

## Local setup

Use Node.js 22.12 or newer and npm 9.6.5 or newer.

```bash
npm ci
npm run dev
```

Astro serves the development site at `http://localhost:4321/` by default. If that port is unavailable, Astro prints the alternate local URL it selects.

`npm ci` installs the exact dependency versions recorded in `package-lock.json`, keeping local and deployment environments reproducible. Use `npm install` only when intentionally adding or updating dependencies, and commit the resulting lockfile changes with `package.json`.

## Commands

```bash
npm run dev          # Start the local development server
npm run edit         # Open the real site with local visual editing controls
npm run check        # Run Astro and TypeScript diagnostics
npm run build        # Type-check, build static output, and audit internal links
npm run check:links  # Check links/assets in an existing dist directory
npm run preview      # Preview the production output locally
npm run content:new -- project project-slug
npm run content:import-summary -- project-slug summary.md
npm audit            # Review dependency advisories
```

The build output is written to `dist/`. Telemetry is disabled in npm scripts so builds behave consistently in local sandboxes and CI.

## Visual local editor

For routine project, publication, and people updates, run:

```bash
npm run edit
```

Then open `http://localhost:44321/`. On Projects, Publications, and People pages, **+ Add** in the lower-right corner opens a guided New Entry form for that section. Hovering over a content card reveals a pencil button that opens that exact entry in the panel, and the panel dropdown remains available for selecting any existing entry. The site shown beneath these controls is the real Astro development site and matches the deployed website. Saving writes directly to the corresponding file under `src/content/`; the editor also stores the previous version under `tmp/content-backups/editor/`. Deleting an entry moves its source file into `tmp/content-backups/editor/deleted/` and is blocked while another content item still links to it.

Non-card page copy has smaller hover pencils that open a nearby text popover. Those fields are backed by structured JSON under `src/data/`, with previous versions saved under `tmp/content-backups/editor/text/`. List-oriented fields such as research topics and application materials are edited one item per line.

Project-detail routes hide the **+ Add** launcher and expose focused inline editors for project metadata and the full Markdown research summary, plus a header pencil for the complete project form.

The editing API binds only to localhost and is injected only by `npm run edit`. It is not included in `npm run build` or the Cloudflare deployment. Stop it with `Ctrl+C`. Run `npm run build` before committing or deploying your edits.

Use `--port <number>` only when a different local editor port is needed. Each editor port receives a separate generated Astro cache, so the editor can safely run beside a normal `npm run dev` server without both processes writing the same data-store file.

For an Access-protected Cloudflare Tunnel route, supply its values at startup instead of storing deployment-specific details in the repository:

```bash
npm run edit -- --public-origin https://dev.example.com --base /editor-path
```

Then open `https://dev.example.com/editor-path/`. The tunnel service should target `http://localhost:44321`, preserve the configured request path, and route the path itself plus all descendants. The regular `npm run edit` command remains localhost-only at the site root. The equivalent `CONTENT_EDITOR_PUBLIC_ORIGIN` and `CONTENT_EDITOR_BASE` environment variables are also supported.

## Project structure

```text
src/
├── components/        Reusable UI components
├── content/           One Markdown/YAML file per project, publication, or person
├── data/              Small shared site settings and typed content loaders
├── layouts/           Shared metadata, header, and footer shell
├── pages/             Static routes, dynamic project routes, and generated robots.txt
└── styles/            Global design system and responsive rules
public/
├── brand/             CVI Lab logo and replaceable brand assets
├── images/            Website imagery, generated portraits, and project placeholders
└── _headers           Cloudflare security/cache headers
scripts/
├── check-links.mjs           Static output link and asset audit
├── content-editor.mjs        Local editor server and Astro proxy
├── content-editor/           Local-only editor interface assets
├── new-content.mjs           Safe content-file scaffolder
└── import-paper-summary.mjs  Paper-summary importer for project pages
```

## Updating content

- Laboratory identity, metadata, address, email, mission, and shared copy: `src/data/site.json`
- Navigation: `src/data/navigation.ts`
- Research themes and topic tags: `src/data/research.json`
- People and alumni: one file per person in `src/content/people/`
- Projects and project-detail content: one Markdown file per project in `src/content/projects/`
- Publications and BibTeX: one YAML file per publication in `src/content/publications/`
- Recruitment details: `src/data/join.json`
- Page-specific headings and supporting copy: `src/data/page-copy.json`
- Palette, type scale, spacing, and responsive behavior: `src/styles/global.css`

See [`CONTENT_GUIDE.md`](CONTENT_GUIDE.md) for beginner-friendly instructions covering new projects and publications, featured projects, paper-summarizer imports, member status changes, ordering, and validation.

Optional links are omitted when their URL is unavailable. Replace placeholder URLs with confirmed values rather than adding `#` links.

## Replacing assets

Public asset paths are stable, so approved files can replace placeholders without component edits:

- `public/brand/ubc-logo-placeholder.svg`
- `public/images/projects/trisim-placeholder.jpg`
- `public/images/projects/cppmn-placeholder.jpg`
- `public/images/social-preview-cvi-lab.jpg`

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
- `src/data/site.json`

`robots.txt` is generated by `src/pages/robots.txt.ts`; sitemap files are generated by `@astrojs/sitemap`. Canonical URLs, Open Graph URLs, sitemap URLs, navigation, and asset references use the production domain and configured base. If a base is added later, update `astro.config.mjs` and the matching cache path in `public/_headers`, then rebuild.

Also replace generated people/project placeholders, approved logos, profile links, and the GitHub organization placeholder as official material becomes available.
