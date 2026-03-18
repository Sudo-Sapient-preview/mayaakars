import fs from "fs";
import path from "path";
import type { ProjectCategory, ProjectSlide } from "./projects-data";

// Maps each filesystem folder name → display metadata for the website
const CATEGORY_META: Record<
    string,
    Omit<ProjectCategory, "coverImage" | "slides">
> = {
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

// Display order on the website
const CATEGORY_ORDER = [
    "architect-residence",
    "architect-commercial",
    "interior-residencial",
    "interior-commercial",
];

/** Convert a folder name to a human-readable title.
 *  Folders with spaces/parens are already human-readable — keep them.
 *  Kebab-case folders get converted to Title Case.
 */
function toTitle(folder: string): string {
    if (folder.includes(" ")) return folder;
    return folder
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Find the best cover image inside a project folder.
 *  Prefers named covers; falls back to first .webp alphabetically.
 *  Also checks one level of subdirectories (handles nested folder quirks).
 */
function getFirstWebp(dir: string): string | null {
    try {
        // Priority named covers
        const priority = ["cover.webp", "title-photo.webp", "cover-photo.webp"];
        for (const name of priority) {
            if (fs.existsSync(path.join(dir, name))) return name;
        }

        // Direct webp files
        const files = fs
            .readdirSync(dir)
            .filter((f) => f.toLowerCase().endsWith(".webp"))
            .sort();
        if (files[0]) return files[0];

        // One level of subdirectories (e.g. Sandeep ( Sarjapur )/Sandeep ( Sarjapur )/)
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

/** Scan public/Mayaakars/ and return a ProjectCategory[] array.
 *  Any new sub-folder added under a category folder is automatically picked up.
 */
export function scanProjects(): ProjectCategory[] {
    const publicDir = path.join(process.cwd(), "public", "Mayaakars");
    const result: ProjectCategory[] = [];

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

        const slides: ProjectSlide[] = [];
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
