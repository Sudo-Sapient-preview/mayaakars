import GalleryGrid from "./GalleryGrid";

// Only images from public/gallery folder
const GALLERY_IMAGES = [
    "/gallery/22.webp",
    "/gallery/27.webp",
    "/gallery/36.webp",
    "/gallery/bedroom-3-1-.webp",
    "/gallery/bedroom1.webp",
    "/gallery/cabin copy.webp",
    "/gallery/cabin.webp",
    "/gallery/dining-.webp",
    "/gallery/dining-area.webp",
    "/gallery/drawing-room-1-.webp",
    "/gallery/entrance-1-.webp",
    "/gallery/Hero image  copy 2.webp",
    "/gallery/Hero Image .webp",
    "/gallery/Hero Image.webp",
    "/gallery/hospital-gallery-24.webp",
    "/gallery/innova8-2.webp",
    "/gallery/lobby-area.webp",
    "/gallery/Residential Architecture .webp",
    "/gallery/Residential Interior .webp",
    "/gallery/stairs.webp",
    "/gallery/title-photo.webp",
    "/gallery/wadrobe.webp",
    "/gallery/_DSC0740.webp",
    "/gallery/_DSC0928.webp",
    "/gallery/_DSC0934.webp",
    "/gallery/_DSC0972.webp",
    "/gallery/_DSC1013.webp",
    "/gallery/_DSC1066.webp",
    "/gallery/_DSC1635.webp",
    "/gallery/_DSC1650.webp",
    "/gallery/_DSC1661.webp",
    "/gallery/_DSC1685.webp",
    "/gallery/_DSC1804.webp",
    "/gallery/_DSC2444.webp",
    "/gallery/_DSC2451.webp",
    "/gallery/_DSC2624.webp",
    "/gallery/_DSC2730.webp",
    "/gallery/e68cd27e-d81f-40ee-af23-ebb05cd7f33c.webp",
];

// Grid thumbnails: optimized via Next.js image API (~640px), full-res for lightbox
const toThumb = (src: string) =>
    `/_next/image?url=${encodeURIComponent(src)}&w=640&q=75`;

const items = GALLERY_IMAGES.map((src) => ({
    thumb: toThumb(src),
    full: src,
}));

const preloadThumbs = GALLERY_IMAGES.slice(0, 8).map(toThumb);

export default function GalleryPage() {
    return (
        <>
            {preloadThumbs.map((src) => (
                <link key={src} rel="preload" as="image" href={src} />
            ))}
            <GalleryGrid items={items} />
        </>
    );
}
