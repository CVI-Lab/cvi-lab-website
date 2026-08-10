export type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type ResearchArea = {
  id: string;
  name: string;
  shortDescription: string;
  extendedDescription: string;
  topics: string[];
  accent: 'mist' | 'sage' | 'sand';
  visual: 'surface' | 'signal' | 'trust';
};

export type Person = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  researchInterests?: string;
  email?: string;
  biography?: string;
  links?: LinkItem[];
};

export type Alumnus = {
  id: string;
  name: string;
  category: 'pi' | 'postdoc' | 'phd' | 'masters' | 'undergraduate';
  formerRole: string;
  avatar: string;
  currentPosition?: string;
  currentOrganization?: string;
  location?: string;
  link?: string;
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  overviewImage: string;
  imageAlt: string;
  visualCaption: string;
  venue: string;
  venueLong: string;
  year: number;
  projectUrl?: string;
  paperUrl?: string;
  codeUrl?: string;
  tags: string[];
  featured: boolean;
  featuredOrder?: number;
  order: number;
  publicationId?: string;
  placeholderLabel?: string;
  authors: string[];
};

export type Publication = {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  venueShort?: string;
  year: number;
  month?: string;
  pages?: string;
  thumbnail?: string;
  summary?: string;
  projectSlug?: string;
  paperUrl?: string;
  codeUrl?: string;
  projectUrl?: string;
  bibtex: string;
  placeholderLabel?: string;
  order: number;
};
