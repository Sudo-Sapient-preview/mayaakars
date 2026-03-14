import "server-only";
import fs from "fs";
import path from "path";

export type GalleryItem = {
    id: string;
    title: string;
    category: string;
    coverImage: string;
    images: string[];
};

const MAYAAKARS_DIR = path.join(process.cwd(), "public", "Mayaakars");

const CATEGORY_PREFIX: Record<string, string> = {
    "architect-commercial": "acom",
    "architect-residence": "ares",
    constructions: "cons",
    "interior-commercial": "icom",
    "interior-residencial": "ires",
};

function slugify(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function toHumanTitle(folderName: string): string {
    return folderName
        .replace(/\s*\(.*?\)\s*/g, " ") // strip parenthetical
        .replace(/[-_]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getWebpFiles(dir: string): string[] {
    try {
        return fs
            .readdirSync(dir)
            .filter((f) => f.toLowerCase().endsWith(".webp"))
            .sort();
    } catch {
        return [];
    }
}

/** Convert absolute path under public/ → URL path (always forward-slashes). */
function toPublicUrl(absPath: string): string {
    const publicRoot = path.join(process.cwd(), "public");
    return absPath.slice(publicRoot.length).replace(/\\/g, "/");
}

let _cache: GalleryItem[] | null = null;

export function getGalleryManifest(): GalleryItem[] {
    if (_cache) return _cache;

    const items: GalleryItem[] = [];

    const categories = fs
        .readdirSync(MAYAAKARS_DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

    for (const category of categories) {
        const prefix = CATEGORY_PREFIX[category];
        if (!prefix) continue;

        const categoryDir = path.join(MAYAAKARS_DIR, category);
        const folders = fs
            .readdirSync(categoryDir, { withFileTypes: true })
            .filter((d) => d.isDirectory())
            .map((d) => d.name);

        for (const folder of folders) {
            let imageDir = path.join(categoryDir, folder);

            // Handle nested case: e.g. Sandeep (Sarjapur)/Sandeep (Sarjapur)/
            const topLevelWebp = getWebpFiles(imageDir);
            if (topLevelWebp.length === 0) {
                const sub = fs
                    .readdirSync(imageDir, { withFileTypes: true })
                    .filter((d) => d.isDirectory());
                if (sub.length === 1) {
                    imageDir = path.join(imageDir, sub[0].name);
                }
            }

            const webpFiles = getWebpFiles(imageDir);
            if (webpFiles.length === 0) continue; // skip folders with no web images (e.g. ARW-only)

            const id = `${prefix}-${slugify(folder)}`;
            const title = toHumanTitle(folder);
            const coverImage = toPublicUrl(path.join(imageDir, webpFiles[0]));
            const images = webpFiles.map((f) => toPublicUrl(path.join(imageDir, f)));

            items.push({ id, title, category, coverImage, images });
        }
    }

    _cache = items;
    return items;
}

export function getGalleryItem(id: string): GalleryItem | undefined {
    return getGalleryManifest().find((item) => item.id === id);
}
