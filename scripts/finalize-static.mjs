import fs from 'node:fs';
import path from 'node:path';

const exportRoot = path.resolve('dist/client');
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');
if (basePath && !/^\/[a-zA-Z0-9._/-]+$/.test(basePath))
  throw new Error('Invalid Pages base path.');
const publicRoot = path.resolve(exportRoot, `.${basePath || '/'}`);
if (publicRoot !== exportRoot && !publicRoot.startsWith(exportRoot + path.sep))
  throw new Error('Base path escapes the static export.');

// Vinext includes basePath in the output tree. Pages mounts the uploaded
// directory at that path itself, so upload publicRoot (not its parent).
if (publicRoot !== exportRoot)
  fs.copyFileSync(
    path.join(exportRoot, '404.html'),
    path.join(publicRoot, '404.html'),
  );
fs.writeFileSync(path.join(publicRoot, '.nojekyll'), '');
const catalog = JSON.parse(
  fs.readFileSync('content/stories/catalog.json', 'utf8'),
);
if (new Set(catalog.map((story) => story.slug)).size !== catalog.length)
  throw new Error('Duplicate story slug.');
for (const file of [
  'index.html',
  '404.html',
  'blogs/index.html',
  'resume/index.html',
  'files/Hrishikesh_Bhardwaj_Resume.pdf',
  ...catalog.map((story) => `stories/${story.slug}/index.html`),
]) {
  if (!fs.existsSync(path.join(publicRoot, file)))
    throw new Error(`Static export is missing ${file}`);
}

function collect(directory, extension) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory()
      ? collect(file, extension)
      : entry.name.endsWith(extension)
        ? [file]
        : [];
  });
}
let referenceCount = 0;
function checkReference(url, file) {
  if (!url.startsWith('/') || url.startsWith('//')) return;
  const pathname = decodeURIComponent(url.split(/[?#]/)[0]);
  if (basePath && pathname !== basePath && !pathname.startsWith(basePath + '/'))
    throw new Error(`Unprefixed URL ${url} in ${file}`);
  const relative = pathname.slice(basePath.length).replace(/^\//, '');
  const target = path.resolve(publicRoot, relative);
  if (target !== publicRoot && !target.startsWith(publicRoot + path.sep))
    throw new Error('Invalid asset path.');
  if (
    !fs.existsSync(target) &&
    !fs.existsSync(target + '.html') &&
    !fs.existsSync(path.join(target, 'index.html'))
  )
    throw new Error(`Missing ${url} referenced by ${file}`);
  referenceCount++;
}
for (const file of collect(publicRoot, '.html')) {
  const html = fs.readFileSync(file, 'utf8');
  for (const [, url] of html.matchAll(/(?:src|href)="([^"#]+)"/g))
    checkReference(url, file);
}
for (const file of collect(publicRoot, '.css')) {
  for (const [, url] of fs
    .readFileSync(file, 'utf8')
    .matchAll(/url\(["']?([^"')]+)["']?\)/g))
    checkReference(url, file);
}
console.log(
  `Static portfolio ready in ${path.relative(process.cwd(), publicRoot)}; ${referenceCount} local references verified.`,
);
