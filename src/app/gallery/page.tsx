import { getGalleryManifest } from "@/lib/gallery-data";
import GalleryGrid from "./GalleryGrid";

export const dynamic = "force-static";
export const revalidate = false;

export default function GalleryPage() {
    const items = getGalleryManifest();
    return <GalleryGrid items={items} />;
}
