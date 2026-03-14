import { getGalleryManifest } from "@/lib/gallery-data";
import GalleryGrid from "./GalleryGrid";

export default function GalleryPage() {
    const items = getGalleryManifest();
    return <GalleryGrid items={items} />;
}
