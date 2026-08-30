import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    summary: z.string(),
    publication: z.string(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string(),
    }),
    tags: z.array(z.string()).min(1),
    featured: z.boolean().default(false),
    featuredOrder: z.number().int().positive().optional(),
    order: z.number().int().positive().default(100),
    placeholderLabel: z.string().optional(),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()).min(1),
    venue: z.string(),
    venueShort: z.string().optional(),
    year: z.number().int(),
    month: z.string().optional(),
    pages: z.string().optional(),
    project: z.string().optional(),
    links: z.object({
      project: z.string().optional(),
      paper: z.string().optional(),
      code: z.string().optional(),
    }).default({}),
    bibtex: z.string().default(''),
    order: z.number().int().positive().default(100),
    placeholderLabel: z.string().optional(),
  }),
});

const people = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    status: z.enum(['current', 'alumni']),
    category: z.enum(['pi', 'postdoc', 'visiting', 'phd', 'masters', 'undergraduate']),
    role: z.string(),
    avatar: z.string(),
    order: z.number().int().positive().default(100),
    email: z.string().optional(),
    biography: z.array(z.string()).optional(),
    research: z.string().optional(),
    researchInterests: z.string().optional(),
    currentPosition: z.string().optional(),
    currentOrganization: z.string().optional(),
    location: z.string().optional(),
    link: z.string().optional(),
    links: z.array(z.object({
      label: z.string(),
      href: z.string(),
      external: z.boolean().optional(),
    })).optional(),
  }),
});

export const collections = { projects, publications, people };
