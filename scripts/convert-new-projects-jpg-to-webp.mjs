import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceDir = path.join(process.cwd(), 'public', 'New Projects');

// Function to recursively find all jpg files
function getJpgFiles(dir, filesList = []) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getJpgFiles(fullPath, filesList);
        } else {
            if (/\.(jpg|jpeg)$/i.test(fullPath)) {
                filesList.push(fullPath);
            }
        }
    }
    return filesList;
}

async function convertJpgToWebp() {
    const images = getJpgFiles(sourceDir);
    console.log(`Found ${images.length} .jpg files to convert.`);

    let converted = 0;
    let errors = 0;

    for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const statsInfo = fs.statSync(file);
        const originalSize = statsInfo.size;

        const dirName = path.dirname(file);
        const baseName = path.basename(file, path.extname(file));
        const destPath = path.join(dirName, baseName + '.webp');

        try {
            await sharp(file)
                .webp({ quality: 85, effort: 6 })
                .toFile(destPath);

            const newStats = fs.statSync(destPath);
            const savedKB = ((originalSize - newStats.size) / 1024).toFixed(2);
            const reduction = ((1 - newStats.size / originalSize) * 100).toFixed(1);

            console.log(`[${i + 1}/${images.length}] Converted: ${path.relative(sourceDir, file)} -> ${path.relative(sourceDir, destPath)} (Saved: ${savedKB} KB, ${reduction}%)`);

            // Delete the original .jpg file after successful conversion
            fs.unlinkSync(file);
            console.log(`  -> Deleted original: ${path.basename(file)}`);

            converted++;
        } catch (err) {
            console.error(`[${i + 1}/${images.length}] Error processing ${file}:`, err.message);
            errors++;
        }
    }

    console.log(`\nConversion completed! Converted: ${converted}, Errors: ${errors}`);
}

convertJpgToWebp();
