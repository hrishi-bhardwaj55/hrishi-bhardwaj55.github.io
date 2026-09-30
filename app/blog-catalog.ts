import catalog from '@/content/stories/catalog.json';

// Keep article bodies out of the interactive homepage bundle.
export const blogCatalog = catalog;

// Every post lives under the Blogs tab. `/stories/<slug>/` only redirects here.
export function blogPath(slug: string) {
  return `/blogs/${slug}/`;
}
