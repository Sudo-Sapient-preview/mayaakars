/**
 * Pre-generate projects data at build time
 * This avoids including large asset directories in serverless functions
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

const CATEGORY_META = {
    "architect-residence": {
        slug: "residential-architecture",
        title: "Residential Architecture",
        category: "Residential Architecture",
        description:
            "Homes crafted with spatial clarity, natural light, and enduring architectural expression.",
    },
    "architect-commercial": {
        slug: "commercial-architecture",
        title: "Commercial Architecture",
        category: "Commercial Architecture",
        description:
            "Business environments designed for function, presence, and long-term adaptability.",
    },
    "interior-residencial": {
        slug: "residential-interiors",
        title: "Residential Interiors",
        category: "Residential Interiors",
        description:
            "Refined interior spaces shaped around comfort, personal identity, and everyday rituals.",
    },
    "interior-commercial": {
        slug: "commercial-interior",
        title: "Commercial Interior",
        category: "Commercial Interior",
        description:
            "Interiors that improve workflow and customer experience while expressing brand personality.",
    },
};

const CATEGORY_ORDER = [
    "architect-residence",
    "architect-commercial",
    "interior-residencial",
    "interior-commercial",
];

function toTitle(folder) {
    if (folder.includes(" ")) return folder;
    return folder
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getFirstWebp(dir) {
    try {
        const priority = ["cover.webp", "title-photo.webp", "cover-photo.webp"];
        for (const name of priority) {
            if (fs.existsSync(path.join(dir, name))) return name;
        }

        const files = fs
            .readdirSync(dir)
            .filter((f) => f.toLowerCase().endsWith(".webp"))
            .sort();
        if (files[0]) return files[0];

        const subdirs = fs
            .readdirSync(dir, { withFileTypes: true })
            .filter((d) => d.isDirectory());
        for (const sub of subdirs) {
            const subFiles = fs
                .readdirSync(path.join(dir, sub.name))
                .filter((f) => f.toLowerCase().endsWith(".webp"))
                .sort();
            if (subFiles[0]) return `${sub.name}/${subFiles[0]}`;
        }

        return null;
    } catch {
        return null;
    }
}

function generateProjects() {
    const publicDir = path.join(rootDir, "public", "Mayaakars");
    const result = [];

    for (const catFolder of CATEGORY_ORDER) {
        const meta = CATEGORY_META[catFolder];
        if (!meta) continue;

        const catPath = path.join(publicDir, catFolder);
        if (!fs.existsSync(catPath)) continue;

        const projectFolders = fs
            .readdirSync(catPath, { withFileTypes: true })
            .filter((d) => d.isDirectory())
            .map((d) => d.name)
            .sort();

        const slides = [];
        let coverImage = "";

        for (const proj of projectFolders) {
            const projPath = path.join(catPath, proj);
            const first = getFirstWebp(projPath);
            if (!first) continue;

            const imagePath = `/Mayaakars/${catFolder}/${proj}/${first}`;
            if (!coverImage) coverImage = imagePath;

            slides.push({
                title: toTitle(proj),
                image: imagePath,
            });
        }

        if (!slides.length) continue;

        result.push({ ...meta, coverImage, slides });
    }

    return result;
}

function main() {
    const projects = generateProjects();
    const outputPath = path.join(rootDir, "src", "lib", "generated-projects.json");

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2));

    console.log(`✓ Generated projects data: ${outputPath}`);
    console.log(`  ${projects.length} categories found`);
}

main();
