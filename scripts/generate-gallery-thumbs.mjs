import sharp from "sharp";
import { readFileSync, mkdirSync, existsSync } from "fs";
import { join, basename, extname } from "path";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "public", "gallery");

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// Same list as page.tsx — source of truth
const IMAGES = [
    "/Mayaakars/architect-commercial/aurora-healthcare/hospital-main-1.webp",
    "/Mayaakars/architect-commercial/aurora-healthcare/hospital-main-2.webp",
    "/Mayaakars/architect-commercial/skyline-commercial-hub/mumbai-building-1.webp",
    "/Mayaakars/architect-commercial/skyline-commercial-hub/img-20190327-wa0007.webp",
    "/Mayaakars/architect-residence/panorama-house/33.webp",
    "/Mayaakars/architect-residence/panorama-house/12.webp",
    "/Mayaakars/architect-residence/prasad-residence/06.webp",
    "/Mayaakars/architect-residence/prasad-residence/09.webp",
    "/Mayaakars/architect-residence/rathod-residence/2.webp",
    "/Mayaakars/architect-residence/rathod-residence/1.webp",
    "/Mayaakars/interior-commercial/seabreeze-office/lobby-area-2-.webp",
    "/Mayaakars/interior-commercial/seabreeze-office/cubicles-1-.webp",
    "/Mayaakars/interior-commercial/shizuka-nook/entrance.webp",
    "/Mayaakars/interior-commercial/shizuka-nook/4-table-corner.webp",
    "/Mayaakars/interior-commercial/solaris-energy/cubicles.webp",
    "/Mayaakars/interior-commercial/solaris-energy/cabin.webp",
    "/Mayaakars/interior-commercial/the-grid/whatsapp-image-2019-10-16-at-12-39-59-pm-copy.webp",
    "/Mayaakars/interior-commercial/the-grid/whatsapp-image-2019-10-16-at-12-39-37-pm.webp",
    "/Mayaakars/interior-residencial/Ganesh Babu ( Century Ethos )/_DSC2447.webp",
    "/Mayaakars/interior-residencial/Ganesh Babu ( Century Ethos )/_DSC2078.webp",
    "/Mayaakars/interior-residencial/Hari ( Secrete Soil )/_DSC2762.webp",
    "/Mayaakars/interior-residencial/Hari ( Secrete Soil )/_DSC2764.webp",
    "/Mayaakars/interior-residencial/Hari ( Secrete Soil )/_DSC2734.webp",
    "/Mayaakars/interior-residencial/house-of-13-arches/bedroom-1-1-.webp",
    "/Mayaakars/interior-residencial/house-of-13-arches/entrance-.webp",
    "/Mayaakars/interior-residencial/house-of-13-arches/living-space.webp",
    "/Mayaakars/interior-residencial/Krishnappa ( Shobha Hibiscus )/_DSC2488.webp",
    "/Mayaakars/interior-residencial/Krishnappa ( Shobha Hibiscus )/_DSC2467.webp",
    "/Mayaakars/interior-residencial/kumar-residence/living-area.webp",
    "/Mayaakars/interior-residencial/kumar-residence/living-area-1-.webp",
    "/Mayaakars/interior-residencial/panorama-house/coffee-table-.webp",
    "/Mayaakars/interior-residencial/panorama-house/living-room-.webp",
    "/Mayaakars/interior-residencial/panorama-house/dining-room-.webp",
    "/Mayaakars/interior-residencial/patil-residence/bedroom-4.webp",
    "/Mayaakars/interior-residencial/patil-residence/bedroom-1.webp",
    "/Mayaakars/interior-residencial/Pavan Reddy ( Varthur )/_DSC2858.webp",
    "/Mayaakars/interior-residencial/Pavan Reddy ( Varthur )/_DSC2873.webp",
    "/Mayaakars/interior-residencial/Pavan Reddy ( Varthur )/_DSC2871.webp",
    "/Mayaakars/interior-residencial/Shantanu Chakrvarty & Roshni Saraf ( Brigade Exotica )/_DSC0932.webp",
    "/Mayaakars/interior-residencial/Shantanu Chakrvarty & Roshni Saraf ( Brigade Exotica )/_DSC0934.webp",
    "/Mayaakars/interior-residencial/Shantanu Chakrvarty & Roshni Saraf ( Brigade Exotica )/_DSC0900.webp",
    "/Mayaakars/interior-residencial/sharma-residence/living-area-1-.webp",
    "/Mayaakars/interior-residencial/sharma-residence/living-room-.webp",
    "/Mayaakars/interior-residencial/Shesh Secrete Soil/_DSC1949.webp",
    "/Mayaakars/interior-residencial/Shesh Secrete Soil/_DSC2000.webp",
    "/Mayaakars/interior-residencial/Visagan ( Secrete Soil )/_DSC1639.webp",
    "/Mayaakars/interior-residencial/Visagan ( Secrete Soil )/_DSC1573.webp",
    "/Mayaakars/interior-residencial/Visagan ( Secrete Soil )/_DSC1564.webp",
    "/Mayaakars/interior-residencial/WindMills of your Mind/_DSC1082.webp",
    "/Mayaakars/interior-residencial/WindMills of your Mind/_DSC1079.webp",
];

// Derive a flat unique filename from the full path
function thumbName(src) {
    // e.g. "/Mayaakars/interior-commercial/solaris-energy/cubicles.webp"
    // → "interior-commercial--solaris-energy--cubicles.webp"
    const withoutPrefix = src.replace(/^\/Mayaakars\//, "");
    return withoutPrefix
        .replace(/\//g, "--")
        .replace(/\s+/g, "_")
        .replace(/[()&]/g, "")
        .replace(/__+/g, "_")
        .toLowerCase();
}

let ok = 0, skip = 0, fail = 0;

for (const src of IMAGES) {
    const inPath = join(ROOT, "public", src);
    const outName = thumbName(src);
    const outPath = join(OUT_DIR, outName);

    if (existsSync(outPath)) {
        console.log(`  skip  ${outName}`);
        skip++;
        continue;
    }

    try {
        await sharp(inPath)
            .resize({ width: 600, withoutEnlargement: true })
            .webp({ quality: 78 })
            .toFile(outPath);
        console.log(`  ✓  ${outName}`);
        ok++;
    } catch (e) {
        console.error(`  ✗  ${outName}  —  ${e.message}`);
        fail++;
    }
}

console.log(`\nDone: ${ok} generated, ${skip} skipped, ${fail} failed`);
