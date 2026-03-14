import { notFound } from "next/navigation";
import { getGalleryManifest, getGalleryItem } from "@/lib/gallery-data";
import GalleryDetailView from "./GalleryDetailView";

export async function generateStaticParams() {
    return getGalleryManifest().map((item) => ({ imageId: item.id }));
}

export default async function GalleryInsidePage({
    params,
}: {
    params: Promise<{ imageId: string }>;
}) {
    const { imageId } = await params;
    const item = getGalleryItem(imageId);
    if (!item) notFound();

    return (
        <GalleryDetailView
            title={item.title}
            category={item.category}
            images={item.images}
        />
    );
}
