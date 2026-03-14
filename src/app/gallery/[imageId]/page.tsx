import { notFound } from "next/navigation";
import { getGalleryManifest, getGalleryItem } from "@/lib/gallery-data";
import GalleryDetailView from "./GalleryDetailView";

export const dynamic = "force-static";
export const revalidate = false;
export const dynamicParams = false;

export async function generateStaticParams() {
    return getGalleryManifest().map((item) => ({ imageId: item.id }));
}

type GalleryInsidePageProps = {
    params: { imageId: string };
};

export default async function GalleryInsidePage({ params }: GalleryInsidePageProps) {
    const { imageId } = params;
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
