import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceDir = path.join(process.cwd(), 'public', 'Mayaakars');
const destDir = path.join(process.cwd(), 'public', 'Mayaakars-opt');

// Function to recursively find all image files
function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, filesList);
    } else {
      if (/\.(jpg|jpeg|png|webp)$/i.test(name)) {
        filesList.push(name);
      }
    }
  }
  return filesList;
}

async function compressImages() {
  const images = getFiles(sourceDir);
  console.log(`Found ${images.length} images to process.`);

  let totalSaved = 0;
  
  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    const statsInfo = fs.statSync(file);
    const originalSize = statsInfo.size;
    
    const relativePath = path.relative(sourceDir, file);
    const destPath = path.join(destDir, relativePath);
    const destDirPath = path.dirname(destPath);
    
    if (!fs.existsSync(destDirPath)) {
      fs.mkdirSync(destDirPath, { recursive: true });
    }
    
    // Only compress files larger than 500KB or all webp to save space
    if (originalSize > 300 * 1024) {
      try {
        await sharp(file)
          .resize({ width: 1920, withoutEnlargement: true })
          .webp({ quality: 80, effort: 6 })
          .toFile(destPath);
          
        const newStats = fs.statSync(destPath);
        const savedKB = (originalSize - newStats.size) / 1024;
        totalSaved += savedKB;
        console.log(`[${i + 1}/${images.length}] Compressed ${relativePath}: Saved ${savedKB.toFixed(2)} KB.`);
        
      } catch (err) {
        console.error(`Error processing ${file}:`, err.message);
        // Fallback: just copy
        fs.copyFileSync(file, destPath);
      }
    } else {
      fs.copyFileSync(file, destPath);
      // console.log(`[${i + 1}/${images.length}] Copied ${relativePath}: Below threshold.`);
    }
  }

  console.log(`\nCompression completed! Total space saved: ${(totalSaved / 1024).toFixed(2)} MB.`);
}

compressImages();
