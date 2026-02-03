/**
 * Convert SVG icons to PNG format for Chrome Web Store compliance
 * Chrome Web Store requires PNG format icons, not SVG
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [16, 48, 128];
const iconsDir = path.join(__dirname, '../src/icons');

async function convertSvgToPng() {
  console.log('Converting SVG icons to PNG format...\n');

  for (const size of sizes) {
    const svgPath = path.join(iconsDir, `icon-${size}.svg`);
    const pngPath = path.join(iconsDir, `icon-${size}.png`);

    if (!fs.existsSync(svgPath)) {
      console.log(`⚠️  ${svgPath} not found, skipping...`);
      continue;
    }

    try {
      // Read SVG file
      const svgBuffer = fs.readFileSync(svgPath);

      // Convert to PNG using sharp
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(pngPath);

      console.log(`✅ Converted icon-${size}.svg → icon-${size}.png`);

      // Optionally remove the SVG file
      // fs.unlinkSync(svgPath);
      // console.log(`   Removed icon-${size}.svg`);
    } catch (error) {
      console.error(`❌ Error converting icon-${size}.svg:`, error.message);
    }
  }

  console.log('\n✨ Conversion complete!');
  console.log('\nNext steps:');
  console.log('1. Update manifest.json to use .png instead of .svg');
  console.log('2. Delete the .svg files if no longer needed');
}

// Check if sharp is installed
try {
  await import('sharp');
  convertSvgToPng();
} catch (error) {
  console.error('❌ Error: sharp package is not installed');
  console.log('\nPlease install sharp first:');
  console.log('  pnpm add -D sharp');
  console.log('  # or');
  console.log('  npm install --save-dev sharp');
  process.exit(1);
}
