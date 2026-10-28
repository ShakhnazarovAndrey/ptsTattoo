// Converts originals from assets-src/ into WebP sets in public/img/.
// Run once after adding or replacing photos: npm run images
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const SRC = 'assets-src';
const OUT = 'public/img';

async function emit(input, outBase, widths, { quality = 78, extract, grayscale = false } = {}) {
  await fs.mkdir(path.dirname(outBase), { recursive: true });
  for (const w of widths) {
    let img = sharp(input).rotate();
    if (extract) img = img.extract(extract);
    if (grayscale) img = img.grayscale();
    await img
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality })
      .toFile(`${outBase}-${w}.webp`);
  }
}

async function dims(file) {
  const m = await sharp(file).rotate().metadata();
  const swap = m.orientation && m.orientation >= 5;
  return swap ? { w: m.height, h: m.width } : { w: m.width, h: m.height };
}

const manifest = { works: [], studio: [] };

// Hero: master at work, already on a black background
await emit(`${SRC}/hero.jpg`, `${OUT}/hero`, [800, 1400, 2000], { quality: 80 });

// About: close-up of the hands at work, cropped from the hero photo
await emit(`${SRC}/hero.jpg`, `${OUT}/detail`, [800, 1200], {
  quality: 80,
  extract: { left: 900, top: 1850, width: 1800, height: 2160 },
});

// Portrait: the original PNG is a round photo on white, cut the circle out with transparency
{
  const size = 760;
  const circle = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`,
  );
  await sharp(`${SRC}/portrait.png`)
    .extract({ left: 587, top: 328, width: size, height: size })
    .ensureAlpha()
    .composite([{ input: circle, blend: 'dest-in' }])
    .webp({ quality: 82 })
    .toFile(`${OUT}/portrait-760.webp`);
}

for (const f of (await fs.readdir(`${SRC}/works`)).filter((f) => f.endsWith('.jpg')).sort()) {
  const id = path.basename(f, '.jpg');
  await emit(`${SRC}/works/${f}`, `${OUT}/works/${id}`, [640, 1280]);
  manifest.works.push({ id, ...(await dims(`${SRC}/works/${f}`)) });
}

for (const f of (await fs.readdir(`${SRC}/studio`)).filter((f) => f.endsWith('.jpg')).sort()) {
  const id = path.basename(f, '.jpg');
  await emit(`${SRC}/studio/${f}`, `${OUT}/studio/${id}`, [800, 1280]);
  manifest.studio.push({ id, ...(await dims(`${SRC}/studio/${f}`)) });
}

// Social preview card 1200x630
await sharp(`${SRC}/hero.jpg`)
  .rotate()
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82 })
  .toFile(`${OUT}/og.jpg`);

await fs.writeFile('src/data/images.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`works: ${manifest.works.length}, studio: ${manifest.studio.length}`);
