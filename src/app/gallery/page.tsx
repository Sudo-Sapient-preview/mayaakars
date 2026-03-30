import GalleryGrid from "./GalleryGrid";

// Only images from public/gallery folder
const GALLERY_IMAGES = [
    "/gallery/22.webp",
    "/gallery/27.webp",
    "/gallery/36.webp",
    "/gallery/bedroom-3-1-.webp",
    "/gallery/bedroom1.webp",
    "/gallery/cabin.webp",
    "/gallery/dining-.webp",
    "/gallery/drawing-room-1-.webp",
    "/gallery/entrance-1-.webp",
    "/gallery/Hero Image.webp",
    "/gallery/hospital-gallery-24.webp",
    "/gallery/innova8-2.webp",
    "/gallery/lobby-area.webp",
    "/gallery/Residential Architecture .webp",
    "/gallery/Residential Interior.webp",
    "/gallery/stairs.webp",
    "/gallery/title-photo.webp",
    "/gallery/wadrobe.webp",
    "/gallery/_DSC0928.webp",
    "/gallery/_DSC1066.webp",
    "/gallery/_DSC2444.webp",
    "/gallery/_DSC2624.webp",
    "/gallery/e68cd27e-d81f-40ee-af23-ebb05cd7f33c.webp",
    // Bedroom
    "/Mayaakars/interior-residencial/Abhishek%20Ray%20%26%20Pinky%20Ray%20(%20Another%20Sky%20By%20Living%20Wall%20)/_DSC0247.webp",
    "/Mayaakars/interior-residencial/kumar-residence/bedroom-2.webp",
    "/Mayaakars/interior-residencial/patil-residence/bedroom-1.webp",
    "/Mayaakars/interior-residencial/Shesh%20(%20Secret%20Soil%20)/_DSC1939.webp",
    "/Mayaakars/interior-residencial/Visagan%20(%20Secrete%20Soil%20)/_DSC1773.webp",
    // Living Room
    "/Mayaakars/interior-residencial/Hari%20(%20Secrete%20Soil%20)/Hero%20Image.webp",
    "/Mayaakars/interior-residencial/Abhishek%20Ray%20%26%20Pinky%20Ray%20(%20Another%20Sky%20By%20Living%20Wall%20)/_DSC0178.webp",
    "/Mayaakars/interior-residencial/Hari%20(%20Secrete%20Soil%20)/_DSC2735.webp",
    "/Mayaakars/interior-residencial/house-of-13-arches/living-area.webp",
    "/Mayaakars/interior-residencial/kumar-residence/living-area-1-.webp",
    "/Mayaakars/interior-residencial/panorama-house/hall-.webp",
    "/Mayaakars/interior-residencial/patil-residence/living-area.webp",
    // Dining Room
    "/Mayaakars/interior-residencial/house-of-13-arches/dining-area.webp",
    "/Mayaakars/interior-residencial/kumar-residence/dining-area.webp",
    "/Mayaakars/interior-residencial/panorama-house/dining-room-.webp",
    "/Mayaakars/interior-residencial/patil-residence/dining-.webp",
    "/Mayaakars/interior-residencial/Shesh%20(%20Secret%20Soil%20)/b1daf05b-0b7c-4c05-af35-653bb8f797fe.webp",
    // Kitchen
    "/Mayaakars/interior-residencial/Visagan%20(%20Secrete%20Soil%20)/_DSC1625.webp",
    "/Mayaakars/interior-residencial/Hari%20(%20Secrete%20Soil%20)/_DSC2719.webp",
    "/Mayaakars/interior-residencial/house-of-13-arches/kitchen-.webp",
    "/Mayaakars/interior-residencial/kumar-residence/kitchen-.webp",
    "/Mayaakars/interior-residencial/panorama-house/kitchen-.webp",
    "/Mayaakars/interior-residencial/Shantanu%20Chakrvarty%20%26%20Roshni%20Saraf%20(%20Brigade%20Exotica%20)/_DSC0596.webp",
    "/Mayaakars/interior-residencial/Shesh%20(%20Secret%20Soil%20)/b9c6d3ba-e76a-4357-aec4-313c28e6f55a.webp",
    // Mandri
    "/Mayaakars/interior-residencial/panorama-house/puja-room-1-.webp",
    "/Mayaakars/interior-residencial/patil-residence/puja-room.webp",
    "/Mayaakars/interior-residencial/Shantanu%20Chakrvarty%20%26%20Roshni%20Saraf%20(%20Brigade%20Exotica%20)/_DSC0731.webp",
    "/Mayaakars/interior-residencial/Abhishek%20Ray%20%26%20Pinky%20Ray%20(%20Another%20Sky%20By%20Living%20Wall%20)/_DSC0347.webp",
    "/Mayaakars/interior-residencial/Shantanu%20Chakrvarty%20%26%20Roshni%20Saraf%20(%20Brigade%20Exotica%20)/_DSC0729.webp",
    // Decor
    "/Mayaakars/interior-residencial/Shantanu%20Chakrvarty%20%26%20Roshni%20Saraf%20(%20Brigade%20Exotica%20)/_DSC0812.webp",
    "/Mayaakars/interior-residencial/Visagan%20(%20Secrete%20Soil%20)/_DSC1741.webp",
    "/Mayaakars/interior-residencial/Shesh%20(%20Secret%20Soil%20)/9b333084-f942-47df-ac25-a1676bdb6f42.webp",
    "/Mayaakars/interior-residencial/Shesh%20(%20Secret%20Soil%20)/_DSC1843.webp",
    "/Mayaakars/interior-residencial/Ganesh%20Babu%20(%20Century%20Ethos%20)/3.webp",
    "/Mayaakars/interior-residencial/Visagan%20(%20Secrete%20Soil%20)/_DSC1593.webp",
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
