import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const screenshotsSource = fileURLToPath(new URL('../../../docs/screenshots/', import.meta.url));
const screenshotsTarget = fileURLToPath(new URL('../public/screenshots/', import.meta.url));
const icons = ['app-icon-192.png', 'apple-touch-icon.png'];

await mkdir(screenshotsTarget, { recursive: true });

for (const name of await readdir(screenshotsSource)) {
  if (!/\.(png|jpe?g|webp)$/i.test(name)) continue;
  await copyFile(`${screenshotsSource}/${name}`, `${screenshotsTarget}/${name}`);
}

for (const name of icons) {
  await copyFile(new URL(`../../../public/${name}`, import.meta.url), new URL(`../public/${name}`, import.meta.url));
}
