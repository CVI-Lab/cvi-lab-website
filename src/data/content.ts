import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Alumnus, Person, Project, Publication } from './types';

export async function getPublications(): Promise<Publication[]> {
  const entries = await getCollection('publications');

  return entries
    .map(({ id, data }) => ({
      id,
      title: data.title,
      authors: data.authors,
      venue: data.venue,
      venueShort: data.venueShort,
      year: data.year,
      month: data.month,
      pages: data.pages,
      projectSlug: data.project,
      projectUrl: data.links.project,
      paperUrl: data.links.paper,
      codeUrl: data.links.code,
      bibtex: data.bibtex,
      placeholderLabel: data.placeholderLabel,
      order: data.order,
    }))
    .sort((a, b) => b.year - a.year || b.order - a.order);
}

export async function getProjects(): Promise<Project[]> {
  const [entries, publications] = await Promise.all([
    getCollection('projects'),
    getPublications(),
  ]);
  const publicationById = new Map(publications.map((publication) => [publication.id, publication]));

  return entries
    .sort((a, b) => b.data.order - a.data.order)
    .map(({ id, data }) => {
      const publication = publicationById.get(data.publication);
      if (!publication) {
        throw new Error(`Project "${id}" references missing publication "${data.publication}".`);
      }

      return {
        slug: id,
        title: data.title,
        subtitle: data.subtitle,
        summary: data.summary,
        overviewImage: data.image.src,
        imageAlt: data.image.alt,
        visualCaption: data.image.caption,
        venue: publication.venueShort ?? publication.venue,
        venueLong: publication.venue,
        year: publication.year,
        projectUrl: publication.projectUrl,
        paperUrl: publication.paperUrl,
        codeUrl: publication.codeUrl,
        tags: data.tags,
        featured: data.featured,
        featuredOrder: data.featuredOrder,
        publicationId: publication.id,
        placeholderLabel: data.placeholderLabel,
        authors: publication.authors,
        order: data.order,
      };
    });
}

const currentCategoryOrder = new Map([
  ['postdoc', 0],
  ['phd', 1],
  ['masters', 2],
  ['undergraduate', 3],
]);

const toPerson = ({ id, data }: CollectionEntry<'people'>): Person => ({
  id,
  name: data.name,
  role: data.role,
  avatar: data.avatar,
  email: data.email,
  biography: data.biography?.join(' '),
  researchInterests: data.researchInterests,
  links: data.links,
});

export async function getPeople() {
  const entries = await getCollection('people');
  const piEntry = entries.find(({ data }) => data.category === 'pi' && data.status === 'current');

  if (!piEntry) {
    throw new Error('The people collection must contain one current principal investigator.');
  }

  const current = entries
    .filter(({ data }) => data.status === 'current' && data.category !== 'pi')
    .sort((a, b) => {
      const categoryDifference = (currentCategoryOrder.get(a.data.category) ?? 99)
        - (currentCategoryOrder.get(b.data.category) ?? 99);
      return categoryDifference || b.data.order - a.data.order;
    });

  const alumni: Alumnus[] = entries
    .filter(({ data }) => data.status === 'alumni')
    .sort((a, b) => {
      const categoryDifference = (currentCategoryOrder.get(a.data.category) ?? 99)
        - (currentCategoryOrder.get(b.data.category) ?? 99);
      return categoryDifference || b.data.order - a.data.order;
    })
    .map(({ id, data }) => ({
      id,
      name: data.name,
      category: data.category,
      formerRole: data.role,
      avatar: data.avatar,
      currentPosition: data.currentPosition,
      currentOrganization: data.currentOrganization,
      location: data.location,
      link: data.link,
    }));

  const currentByCategory = (category: 'postdoc' | 'phd' | 'masters' | 'undergraduate') => current
    .filter(({ data }) => data.category === category)
    .map(toPerson);

  return {
    principalInvestigator: toPerson(piEntry),
    piBiography: piEntry.data.biography ?? [],
    piResearch: piEntry.data.research ?? '',
    postdoctoralResearchers: currentByCategory('postdoc'),
    phdStudents: currentByCategory('phd'),
    mscStudents: currentByCategory('masters'),
    undergraduateResearchers: currentByCategory('undergraduate'),
    alumni,
  };
}
