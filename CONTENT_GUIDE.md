# Content Maintenance Guide

Routine content changes do not require editing Astro components or TypeScript data arrays. Content is stored as one small file per item:

```text
src/content/
├── projects/       One Markdown file per project
├── publications/   One YAML file per publication
└── people/         One YAML file per person
```

Astro validates these files during `npm run check` and reports the filename and invalid field when something is missing or misspelled.

## Recommended: visual local editor

Start the editor from the website directory:

```bash
npm run edit
```

Open `http://localhost:44321/`, then use **+ Add** in the lower-right corner of a Projects, Publications, or People page to start a new entry for that section. The selector displays **New Entry** while creating, and its dropdown still lists every existing entry. Hover over any project, publication, member, or alumni card and select its pencil button to edit that exact entry directly. Changes save directly to `src/content/`. The guided creation form generates the internal identifier from the title or name and explains when that identifier appears in a URL. The **+ Add** launcher is hidden on Home, About, Join, and Contact because those pages do not contain maintainable collection entries.

To change an item's position, hover over a card and drag its six-dot handle. Projects can be reordered across the Projects page; publications stay within their year; people stay within their current/alumni category; and the three visible featured projects can be reordered on Home. A newly created project, publication, or person is placed at the front of its applicable group automatically.

Other page headings, paragraphs, research-area descriptions, recruitment details, contact copy, and footer text have smaller pencil buttons that appear on hover or keyboard focus. Selecting one opens a compact text popover beside the content. List fields use one item per line. These edits are stored in structured JSON files under `src/data/`, and each save creates a timestamped backup under `tmp/content-backups/editor/text/`.

On a project-detail page, **+ Add** is hidden. The pencil in the project header opens the complete project form; smaller pencils edit the visible title, subtitle, tags, image caption, or full detail Markdown in a focused popover.

The editor shows the actual Astro site and adds its controls only for this local session. It is not built into or exposed by the Cloudflare website. Every update to an existing item creates a timestamped backup under `tmp/content-backups/editor/`. **Delete** moves the source file into `tmp/content-backups/editor/deleted/` rather than permanently erasing it. A publication or project cannot be deleted until links to it from other content entries are removed.

For remote development through the configured Cloudflare Access route, use:

```bash
npm run edit -- --public-origin https://dev.example.com --base /editor-path
```

Then open the matching public URL. The editor still listens only on this machine's loopback interface; `cloudflared` connects to `http://localhost:44321`. Keep the entire editor path tree protected by the same Access policy because its pages, assets, WebSocket connection, and save API all use that prefix.

For a new project, create its publication in the Publications tab first. Then create the project and select that publication by title in the guided form. The editor automatically adds the project backlink to the publication; the publication panel displays this managed field as read-only. If the project is later assigned to another publication, the old backlink is removed and the new one is added. Image files still need to be copied into `public/images/` separately; enter their public path in the editor.

After editing, stop the server with `Ctrl+C`, then validate everything with:

```bash
npm run build
```

## Manual editing workflow

1. Edit or create the relevant content file.
2. Run `npm run check`.
3. Run `npm run dev` and inspect the page in a browser.
4. Before deployment, run `npm run build`.

YAML uses spaces for indentation; do not use tabs. Text containing unusual punctuation or a colon can be wrapped in quotes.

## Add a publication

Create a file from the supplied template:

```bash
npm run content:new -- publication author-2026-short-name
```

Edit the new file under `src/content/publications/`. The filename becomes the publication ID. Important fields are:

- `title`, `authors`, `venue`, `venueShort`, and `year` for the publication list;
- `project` for the related project filename, without `.md`; the visual editor manages this field from the project entry;
- `links.paper`, `links.project`, and `links.code`; delete links that do not exist;
- `bibtex`, normally kept as an indented YAML block after `bibtex: |`; it may remain empty for a newly accepted paper until its citation is finalized;
- `order`, which controls ordering among publications from the same year. Larger numbers appear first; the visual editor manages this value when cards are dragged.

A publication can exist without a project: delete its `project` field in that case.

## Add a project

First create its publication, then create the project:

```bash
npm run content:new -- project project-slug
```

Edit `src/content/projects/project-slug.md`:

- The filename creates `/projects/project-slug/`.
- `publication` must exactly match a filename in `src/content/publications/`, without `.yaml`.
- `summary` is the short description used on cards and in metadata.
- `image.src` may be a public path such as `/images/projects/example.jpg` or a complete remote URL.
- `tags` are the labels displayed on the project card.
- `order` controls the project-list order. Larger numbers appear first; the visual editor manages this value when cards are dragged.
- Everything below the second `---` is ordinary Markdown used on the project-detail page.

When editing files manually, also set the matching publication's `project` field to this project filename. The visual editor performs this reciprocal update automatically.

Project-detail Markdown supports LaTeX formulas. Use `$E = mc^2$` inside a sentence and place display formulas between `$$` delimiters:

```markdown
$$
L = \frac{1}{2} \rho v^2 S C_L
$$
```

LaTeX-style `\[ ... \]` display delimiters are also supported. For summaries that omit the backslashes, an opening `[` and closing `]` on separate lines are treated as a display formula. A normal inline `[reference]` remains ordinary Markdown.

### Change the featured projects

In each project Markdown file, use:

```yaml
featured: true
featuredOrder: 3
```

Set `featured: false` for projects that should leave the Home page. `featuredOrder` controls the featured cards, with larger numbers appearing first. Normally, enable the checkbox in the editor and drag the visible Home-page cards instead of editing this number manually.

## Import a paper-summarizer result

The project page supports the summarizer's eight-section Markdown format. Run the summarizer normally, writing to a temporary file:

```bash
cd paper-summarizer
uv run python paper_summarizer.py paper.pdf -o ../cvi_homepage/tmp/paper.summary.md
```

From the website directory, import it into an existing project:

```bash
npm run content:import-summary -- project-slug tmp/paper.summary.md
```

The importer:

- preserves the project's YAML frontmatter;
- removes the generated duplicate `# Summary of ...` heading;
- converts the eight numbered headings to Roman numerals;
- replaces only the Markdown detail content;
- saves the previous content under `tmp/content-backups/`.

TriSim is the included example of the complete eight-section format. Other existing project pages retain their previous shorter summaries and can be upgraded gradually as paper summaries become available.

## Add or update a person

Create a person file with:

```bash
npm run content:new -- person first-last
```

The important fields are:

```yaml
name: Full Name
status: current
category: masters
role: MSc Student
avatar: /images/people/person-avatar.png
order: 100
```

Allowed `category` values are `pi`, `postdoc`, `visiting`, `phd`, `masters`, and `undergraduate`. Allowed `status` values are `current` and `alumni`. The People page shows the Visiting Scholars section only when at least one current person uses `category: visiting`.

### Move a graduating student to alumni

Only edit that person's existing YAML file. For example:

```yaml
status: alumni
category: phd
role: PhD Graduate
currentPosition: Optional new position
currentOrganization: Optional organization
```

The person automatically leaves the current-member section and appears in the corresponding Alumni subsection. Alumni are grouped as visiting/postdoctoral, PhD, master’s, and bachelor’s, and ordered within each category using the `order` field. Larger numbers appear first; the visual editor manages this value when cards are dragged.

To edit a current title or degree, change only `role`. To replace an avatar, put the image in `public/images/people/` and update `avatar` with its `/images/people/...` public path.

## Shared page-copy files

These smaller, shared settings remain as structured JSON under `src/data/` and are editable through the inline popovers:

- `site.json`: laboratory identity, address, mission, and shared copy;
- `navigation.ts`: header and footer navigation;
- `research.json`: the three research themes;
- `join.json`: recruitment guidance;
- `page-copy.json`: page-specific headings, labels, and supporting copy.

Navigation remains a small TypeScript setting because its labels are coupled to routes. Projects, publications, and people should be maintained only through `src/content/`.
