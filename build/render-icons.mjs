import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const build = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(build);
const master = path.join(root, "public/momo-bot.png");
const iconset = path.join(build, "icon.iconset");
const linux = path.join(build, "icons");
const temporary = mkdtempSync(path.join(tmpdir(), "momo-icons-"));
const scaled = new Map([[1024, master]]);

function png(size) {
  if (!scaled.has(size)) {
    const output = path.join(temporary, `${size}.png`);
    execFileSync("sips", ["-z", String(size), String(size), master, "--out", output]);
    scaled.set(size, output);
  }
  return scaled.get(size);
}

try {
  mkdirSync(iconset, { recursive: true });
  mkdirSync(linux, { recursive: true });
  for (const size of [16, 32, 64, 128, 256, 512]) {
    copyFileSync(png(size), path.join(iconset, `icon_${size}x${size}.png`));
    copyFileSync(png(size * 2), path.join(iconset, `icon_${size}x${size}@2x.png`));
  }
  execFileSync("iconutil", ["-c", "icns", iconset, "-o", path.join(build, "icon.icns")]);
  for (const size of [16, 32, 48, 64, 128, 256, 512]) copyFileSync(png(size), path.join(linux, `${size}x${size}.png`));

  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const directory = Buffer.alloc(6 + 16 * sizes.length);
  directory.writeUInt16LE(1, 2);
  directory.writeUInt16LE(sizes.length, 4);
  let offset = directory.length;
  const images = sizes.map((size, index) => {
    const image = readFileSync(png(size));
    const entry = 6 + index * 16;
    directory[entry] = directory[entry + 1] = size % 256;
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(image.length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += image.length;
    return image;
  });
  writeFileSync(path.join(build, "icon.ico"), Buffer.concat([directory, ...images]));
  copyFileSync(master, path.join(build, "icon-1024.png"));
  copyFileSync(png(512), path.join(root, "electron/resources/app-icon.png"));
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
