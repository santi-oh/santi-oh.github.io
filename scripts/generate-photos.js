import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths relative to project root
const photosDir = path.join(process.cwd(), 'public', 'images', 'grid', 'photos');
const outputFile = path.join(process.cwd(), 'public', 'images', 'grid', 'photos.json');

console.log('Scanning directory:', photosDir);

try {
  // Check if directory exists
  if (!fs.existsSync(photosDir)) {
    console.error(`Error: "${photosDir}" directory not found.`);
    process.exit(1);
  }

  // Read files
  const files = fs.readdirSync(photosDir);
  
  // Filter for images and sort them (Z-A, 9999-0000)
  const photoFiles = files
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }));

  const total = photoFiles.length;

  // Map to JSON structure
  const photos = photoFiles.map((file, index) => ({
    id: String(total - index),
    name: file,
    url: `./photos/${file}`
  }));

  // Write to file
  fs.writeFileSync(outputFile, JSON.stringify(photos, null, 2));
  
  console.log(`Successfully generated manifest for ${photos.length} photos at ${outputFile}`);
} catch (error) {
  console.error('An error occurred:', error);
  process.exit(1);
}
