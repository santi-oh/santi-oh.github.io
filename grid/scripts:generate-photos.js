import fs from 'fs';
import path from 'path';

const photosDir = './photos';
const outputFile = './src/photos.json';

const files = fs.readdirSync(photosDir);
const photos = files
  .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
  .map((file, index) => ({
    id: String(index + 1),
    name: file,
    url: `./photos/${file}` // Relative path for static hosting
  }));

fs.writeFileSync(outputFile, JSON.stringify(photos, null, 2));
console.log(`Generated manifest for ${photos.length} photos.`);