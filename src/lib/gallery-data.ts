import "server-only";
import manifest from "@/data/gallery-manifest.json";

export type GalleryItem = {
    id: string;
    title: string;
    category: string;
    coverImage: string;
    images: string[];
};

const items = manifest as GalleryItem[];

export function getGalleryManifest(): GalleryItem[] {
    return items;
}

export function getGalleryItem(id: string): GalleryItem | undefined {
    return items.find((item) => item.id === id);
}
