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

export const PROJECT_CATEGORIES: ProjectCategory[] = [
    {
        slug: "residential-architecture",
        title: "Residential Architecture",
        category: "Residential Architecture",
        coverImage:
            "/Mayaakars/architect-residence/panorama-house/title-photo.webp",
        description:
            "Homes crafted with spatial clarity, natural light, and enduring architectural expression.",
        slides: [
            {
                title: "Panorama House",
                image: "/Mayaakars/architect-residence/panorama-house/05.webp",
            },
            {
                title: "Prasad Residence",
                image: "/Mayaakars/architect-residence/prasad-residence/03.webp",
            },
            {
                title: "Rathod Residence",
                image: "/Mayaakars/architect-residence/rathod-residence/1.webp",
            },
        ],
    },
    {
        slug: "commercial-architecture",
        title: "Commercial Architecture",
        category: "Commercial Architecture",
        coverImage:
            "/Mayaakars/architect-commercial/aurora-healthcare/hospital-gallery-24.webp",
        description:
            "Business environments designed for function, presence, and long-term adaptability.",
        slides: [
            {
                title: "Aurora Healthcare",
                image: "/Mayaakars/architect-commercial/aurora-healthcare/hospital-gallery-1.webp",
            },
            {
                title: "Skyline Commercial Hub",
                image: "/Mayaakars/architect-commercial/skyline-commercial-hub/22.webp",
            },
        ],
    },
    {
        slug: "residential-interiors",
        title: "Residential Interiors",
        category: "Residential Interiors",
        coverImage:
            "/Mayaakars/interior-residencial/house-of-13-arches/bedroom2.webp",
        description:
            "Refined interior spaces shaped around comfort, personal identity, and everyday rituals.",
        slides: [
            {
                title: "Ganesh Babu (Century Ethos)",
                image: "/Mayaakars/interior-residencial/Ganesh Babu ( Century Ethos )/_DSC2066.webp",
            },
            {
                title: "Hari (Secrete Soil)",
                image: "/Mayaakars/interior-residencial/Hari ( Secrete Soil )/_DSC2721.webp",
            },
            {
                title: "House of 13 Arches",
                image: "/Mayaakars/interior-residencial/house-of-13-arches/bedroom1.webp",
            },
            {
                title: "Krishnappa (Shobha Hibiscus)",
                image: "/Mayaakars/interior-residencial/Krishnappa ( Shobha Hibiscus )/_DSC2458.webp",
            },
            {
                title: "Kumar Residence",
                image: "/Mayaakars/interior-residencial/kumar-residence/bedroom1.webp",
            },
            {
                title: "Panorama House",
                image: "/Mayaakars/interior-residencial/panorama-house/bedroom-.webp",
            },
            {
                title: "Patil Residence",
                image: "/Mayaakars/interior-residencial/patil-residence/bedroom-1.webp",
            },
            {
                title: "Pavan Reddy (Varthur)",
                image: "/Mayaakars/interior-residencial/Pavan Reddy ( Varthur )/_DSC2816.webp",
            },
            {
                title: "Shantanu Chakrvarty & Roshni Saraf (Brigade Exotica)",
                image: "/Mayaakars/interior-residencial/Shantanu Chakrvarty & Roshni Saraf ( Brigade Exotica )/_DSC0762.webp",
            },
            {
                title: "Sharma Residence",
                image: "/Mayaakars/interior-residencial/sharma-residence/bedroom-1.webp",
            },
            {
                title: "Shesh Secrete Soil",
                image: "/Mayaakars/interior-residencial/Shesh Secrete Soil/_DSC1944.webp",
            },
            {
                title: "Visagan (Secrete Soil)",
                image: "/Mayaakars/interior-residencial/Visagan ( Secrete Soil )/_DSC1537.webp",
            },
            {
                title: "WindMills of your Mind",
                image: "/Mayaakars/interior-residencial/WindMills of your Mind/_DSC0976.webp",
            },
        ],
    },
    {
        slug: "commercial-interior",
        title: "Commercial Interior",
        category: "Commercial Interior",
        coverImage:
            "/Mayaakars/interior-commercial/the-grid/whatsapp-image-2019-10-16-at-12-39-59-pm-copy.webp",
        description:
            "Interiors that improve workflow and customer experience while expressing brand personality.",
        slides: [
            {
                title: "Seabreeze Office",
                image: "/Mayaakars/interior-commercial/seabreeze-office/cabin.webp",
            },
            {
                title: "Shizuka Nook",
                image: "/Mayaakars/interior-commercial/shizuka-nook/1-table-corner.webp",
            },
            {
                title: "Solaris Energy",
                image: "/Mayaakars/interior-commercial/solaris-energy/cabin.webp",
            },
            {
                title: "The Grid",
                image: "/Mayaakars/interior-commercial/the-grid/app-26.webp",
            },
        ],
    },
    {
        slug: "constructions",
        title: "Constructions",
        category: "Constructions",
        coverImage:
            "/Mayaakars/constructions/menon-residence-3842-sqft-/1711195345.webp",
        description:
            "Execution-focused work where technical precision and site coordination bring design intent to reality.",
        slides: [
            {
                title: "Balaji (Hennur)",
                image: "/Mayaakars/constructions/Balaji ( Hennur )/_DSC2988.webp",
            },
            {
                title: "Bansal Residence (3852 sqft)",
                image: "/Mayaakars/constructions/bansal-residence-3852sqft/finished-project.webp",
            },
            {
                title: "Bose Residence (4963 sqft)",
                image: "/Mayaakars/constructions/bose-residence-4963sqftsqft/3d-design.webp",
            },
            {
                title: "Chandrashekhar Residence (4297 sqft)",
                image: "/Mayaakars/constructions/chandrashekhar-residence-4297sqft-g3/3d-design-.webp",
            },
            {
                title: "Gayatri Residence (2826 sqft)",
                image: "/Mayaakars/constructions/gayatri-residnece-2826sqft/3d-design.webp",
            },
            {
                title: "Krishna Residence",
                image: "/Mayaakars/constructions/krishna-residence/cover.webp",
            },
            {
                title: "Menon Residence (3842 sqft)",
                image: "/Mayaakars/constructions/menon-residence-3842-sqft-/1711195234.webp",
            },
        ],
    },
];

export function getProjectBySlug(slug: string): ProjectCategory | undefined {
    return PROJECT_CATEGORIES.find((project) => project.slug === slug);
}
