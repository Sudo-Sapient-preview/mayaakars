export const GALLERY_IMAGE_IDS = [
    "1497366216548-37526070297c",
    "1618221195710-dd6b41faaea6",
    "1600585154340-be6161a56a0c",
    "1502672260266-1c1ef2d93688",
    "1513519247388-193ad51ae207",
    "1449844908441-8829872d2607",
    "1503694978374-8b206f366050",
    "1486406146926-c627a92ad1ab",
    "1480074568708-e7b220eb0480",
    "1431538510849-b719825bf08b",
    "1486304873000-235643847519",
    "1513694203232-719a280e022f",
    "1470723710355-95304d8aece4",
    "1506506082216-9baf93ab363e",
    "1490215096531-2fbff99c54e1",
] as const;

export type GalleryImageId = (typeof GALLERY_IMAGE_IDS)[number];

type UnsplashImageOptions = {
    width?: number;
    quality?: number;
};

export function buildUnsplashPhotoUrl(
    imageId: string,
    { width = 500, quality = 80 }: UnsplashImageOptions = {}
): string {
    return `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

export function resolveGalleryImageId(imageId: string | undefined): string {
    if (!imageId) return GALLERY_IMAGE_IDS[0];
    return GALLERY_IMAGE_IDS.includes(imageId as GalleryImageId)
        ? imageId
        : GALLERY_IMAGE_IDS[0];
}
