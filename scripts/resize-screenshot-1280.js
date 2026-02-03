import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = join(__dirname, '../images/screenshot-1280-800.png');
const outputPath = join(__dirname, '../images/screenshot-1280-800-resized.png');

async function resizeImage() {
  try {
    console.log('Checking current dimensions...');
    const metadata = await sharp(inputPath).metadata();
    console.log(`Current size: ${metadata.width}x${metadata.height}`);
    
    console.log('Resizing to exactly 1280x800...');
    
    await sharp(inputPath)
      .resize(1280, 800, {
        fit: 'fill',
        kernel: sharp.kernel.lanczos3
      })
      .png()
      .toFile(outputPath);
    
    console.log('✅ Successfully resized to 1280x800');
    console.log(`Output: ${outputPath}`);
    
    // Verify the output
    const outputMetadata = await sharp(outputPath).metadata();
    console.log(`Verified output size: ${outputMetadata.width}x${outputMetadata.height}`);
  } catch (error) {
    console.error('❌ Error resizing image:', error);
    process.exit(1);
  }
}

resizeImage();
