// GitHub Pages supplies this at build time; Sites and local previews use '/'.
export function sitePath(path: string) {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

// Social cards and canonical links need absolute URLs, which a relative
// basePath cannot supply. Override per deployment when the host changes.
export const siteOrigin = (
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'https://hrishi-bhardwaj55.github.io'
).replace(/\/$/, '');

export function siteUrl(path = '/') {
  return `${siteOrigin}${sitePath(path)}`;
}
