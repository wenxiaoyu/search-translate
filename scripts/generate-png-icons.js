/**
 * Generate PNG icons directly using Canvas
 * This creates simple placeholder icons for Chrome Web Store compliance
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [16, 48, 128];
const iconsDir = path.join(__dirname, '../src/icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

function generatePngIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background with gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  
  // Draw rounded rectangle background
  const radius = size * 0.2;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();

  // Draw text
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🌐', size / 2, size / 2);

  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  const pngPath = path.join(iconsDir, `icon-${size}.png`);
  fs.writeFileSync(pngPath, buffer);
  
  console.log(`✅ Generated icon-${size}.png`);
}

async function main() {
  console.log('Generating PNG icons for Chrome Web Store...\n');

  try {
    // Check if canvas is available
    await import('canvas');
    
    sizes.forEach(size => {
      generatePngIcon(size);
    });

    console.log('\n✨ PNG icons generated successfully!');
    console.log('\nNext steps:');
    console.log('1. Update manifest.json to use .png instead of .svg');
    console.log('2. Delete the .svg files if no longer needed');
  } catch (error) {
    console.error('❌ Error: canvas package is not installed');
    console.log('\nPlease install canvas first:');
    console.log('  pnpm add -D canvas');
    console.log('  # or');
    console.log('  npm install --save-dev canvas');
    console.log('\nAlternatively, use an online tool to convert SVG to PNG:');
    console.log('  - https://cloudconvert.com/svg-to-png');
    console.log('  - https://convertio.co/svg-png/');
    process.exit(1);
  }
}

main();
