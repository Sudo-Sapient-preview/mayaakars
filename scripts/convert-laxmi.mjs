import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceDir = path.join(process.cwd(), 'public', 'Mayaakars', 'interior-residencial', 'Laxmi Paradise Fall');

async function convertJpgToWebp() {
    if (!fs.existsSync(sourceDir)) {
        console.error("Directory not found:", sourceDir);
        return;
    }

    const files = fs.readdirSync(sourceDir);
    const images = files.filter(file => /\.(jpg|jpeg)$/i.test(file));
    
    console.log(`Found ${images.length} .jpg files to convert in ${sourceDir}`);

    let converted = 0;
    let errors = 0;

    for (let i = 0; i < images.length; i++) {
        const fileName = images[i];
        const filePath = path.join(sourceDir, fileName);
        const statsInfo = fs.statSync(filePath);
        const originalSize = statsInfo.size;

        const baseName = path.basename(fileName, path.extname(fileName));
        const destPath = path.join(sourceDir, baseName + '.webp');

        try {
            await sharp(filePath)
                .webp({ quality: 85, effort: 6 })
                .toFile(destPath);

            const newStats = fs.statSync(destPath);
            const savedKB = ((originalSize - newStats.size) / 1024).toFixed(2);
            const reduction = ((1 - newStats.size / originalSize) * 100).toFixed(1);

            console.log(`[${i + 1}/${images.length}] Converted: ${fileName} -> ${baseName}.webp (Saved: ${savedKB} KB, ${reduction}%)`);

            // Delete the original .jpg file after successful conversion
            fs.unlinkSync(filePath);
            console.log(`  -> Deleted original: ${fileName}`);

            converted++;
        } catch (err) {
            console.error(`[${i + 1}/${images.length}] Error processing ${fileName}:`, err.message);
            errors++;
        }
    }

    console.log(`\nConversion completed! Converted: ${converted}, Errors: ${errors}`);
}

convertJpgToWebp();
