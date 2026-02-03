import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = join(__dirname, '../images/screenshot-560-400.png');
const outputPath = join(__dirname, '../images/screenshot-640-400.png');

async function resizeImage() {
  try {
    console.log('Resizing screenshot from 560x400 to 640x400...');
    
    await sharp(inputPath)
      .resize(640, 400, {
        fit: 'fill',
        kernel: sharp.kernel.lanczos3
      })
      .png()
      .toFile(outputPath);
    
    console.log('✅ Successfully resized to 640x400');
    console.log(`Output: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error resizing image:', error);
    process.exit(1);
  }
}

resizeImage();
