// GitHub Pages supplies this at build time; Sites and local previews use '/'.
export function sitePath(path: string) {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
