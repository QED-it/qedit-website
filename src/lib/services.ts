import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { WorkType } from '@/types/blocks';

// Base directory for service content. Align this with however lib/markdown
// resolves content on your setup (your tree has content under src/content).
const SERVICES_DIR = path.join(process.cwd(), 'src', 'content', 'services');

export interface ServiceMeta {
  slug: string;
  title: string;
  tagline?: string;
  intro?: string;
  illustration?: string; // path under /public, e.g. /images/illustrations/…
  order?: number;
  content: string; // markdown body (optional richer intro)
}

export interface WorkMeta {
  slug: string;
  service: string;
  title: string;
  context?: string;
  types?: WorkType[];
  summary?: string;
  date?: string;
  report?: string; // link to the report / repo / talk
  order?: number;
  content: string; // markdown body = the write-up
}

function readMd(file: string) {
  return matter(fs.readFileSync(file, 'utf8'));
}

/** All service slugs = the directories under content/services. */
export function getServiceSlugs(): string[] {
  if (!fs.existsSync(SERVICES_DIR)) return [];
  return fs
    .readdirSync(SERVICES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

/** The intro/meta for one service, from its index.md. */
export function getServiceMeta(slug: string): ServiceMeta | null {
  const file = path.join(SERVICES_DIR, slug, 'index.md');
  if (!fs.existsSync(file)) return null;
  const { data, content } = readMd(file);
  return {
    slug,
    title: data.title ?? slug,
    tagline: data.tagline,
    intro: data.intro,
    illustration: data.illustration,
    order: data.order,
    content,
  };
}

export function getAllServices(): ServiceMeta[] {
  return getServiceSlugs()
    .map(getServiceMeta)
    .filter((s): s is ServiceMeta => s !== null)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

/** Every work file under a service (everything except index.md), sorted. */
export function getServiceWorks(slug: string): WorkMeta[] {
  const dir = path.join(SERVICES_DIR, slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'index.md')
    .map((f) => {
      const workSlug = f.replace(/\.md$/, '');
      const { data, content } = readMd(path.join(dir, f));
      return {
        slug: workSlug,
        service: slug,
        title: data.title ?? workSlug,
        context: data.context,
        types: data.types,
        summary: data.summary,
        date: data.date,
        report: data.report,
        order: data.order,
        content,
      };
    })
    .sort(
      (a, b) =>
        (a.order ?? 999) - (b.order ?? 999) ||
        (b.date ?? '').localeCompare(a.date ?? '')
    );
}

/** A single work + its write-up. */
export function getWork(service: string, work: string): WorkMeta | null {
  const file = path.join(SERVICES_DIR, service, `${work}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = readMd(file);
  return {
    slug: work,
    service,
    title: data.title ?? work,
    context: data.context,
    types: data.types,
    summary: data.summary,
    date: data.date,
    report: data.report,
    order: data.order,
    content,
  };
}

/** Flat list of { service, work } for generateStaticParams on the detail route. */
export function getAllWorkParams(): { service: string; work: string }[] {
  return getServiceSlugs().flatMap((service) =>
    getServiceWorks(service).map((w) => ({ service, work: w.slug }))
  );
}