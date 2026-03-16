export type ProjectSlide = {
    title: string;
    image: string;
};

export type ProjectCategory = {
    slug: string;
    title: string;
    category: string;
    coverImage: string;
    description: string;
    slides: ProjectSlide[];
};
