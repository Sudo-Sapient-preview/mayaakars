export type Service = {
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    scope: string[];
    idealFor: string;
    images: { title: string; src: string }[];
};

export const SERVICES: Service[] = [
    {
        slug: "architecture",
        title: "Architecture",
        subtitle: "Architecture",
        description:
            "Full-spectrum architectural services for residential and commercial projects — from early feasibility to final design delivery. We create buildings that balance structural integrity, spatial clarity, and enduring aesthetic expression.",
        scope: [
            "Site analysis & feasibility studies",
            "Architectural design & detailing",
            "Zoning & spatial efficiency planning",
            "Compliance-oriented drawings",
            "Design coordination & documentation",
        ],
        idealFor: "Homes, villas, offices, retail spaces, clinics, hospitality projects",
        images: [
            { title: "Panorama House", src: "/Mayaakars/architect-residence/panorama-house/title-photo.webp" },
            { title: "Aurora Healthcare", src: "/Mayaakars/architect-commercial/aurora-healthcare/hospital-main-2.webp" },
            { title: "Prasad Residence", src: "/Mayaakars/architect-residence/prasad-residence/03.webp" },
            { title: "Skyline Commercial Hub", src: "/Mayaakars/architect-commercial/skyline-commercial-hub/25.webp" },
            { title: "Rathod Residence", src: "/Mayaakars/architect-residence/rathod-residence/2.webp" },
        ],
    },
    {
        slug: "interior-design",
        title: "Interior Design",
        subtitle: "Interior Design",
        description:
            "Curated interiors for residential and commercial spaces — rooted in comfort, character, and functional beauty. Each space is shaped around the people who use it, their lifestyle, and the story they want to tell.",
        scope: [
            "Space planning & furniture layouts",
            "Concept development & mood boards",
            "Material, finishes & lighting selection",
            "Custom furniture & joinery detailing",
            "Brand-aligned commercial concepts",
            "Vendor coordination & site support",
        ],
        idealFor: "Apartments, villas, renovations, corporate offices, retail, cafes, showrooms",
        images: [
            { title: "Kumar Residence", src: "/Mayaakars/interior-residencial/kumar-residence/bedroom-1.webp" },
            { title: "Seabreeze Office", src: "/Mayaakars/interior-commercial/seabreeze-office/lobby-area-2-.webp" },
            { title: "Shizuka Nook", src: "/Mayaakars/interior-commercial/shizuka-nook/dining-area.webp" },
            { title: "The Grid", src: "/Mayaakars/interior-commercial/the-grid/innova8-2.webp" },
            { title: "Solaris Energy", src: "/Mayaakars/interior-commercial/solaris-energy/lobby-area.webp" },
        ],
    },
    {
        slug: "3d-visualization",
        title: "3D Visualization & Walkthroughs",
        subtitle: "Visualization",
        description:
            "Experience your space before a single brick is laid. Our photorealistic renders and immersive walkthroughs bring proportions, materials, and lighting to life — enabling confident decisions and clear alignment at every stage.",
        scope: [
            "High-quality 3D renders",
            "Immersive walkthrough videos",
            "Design intent visualization",
            "Material & finish studies",
        ],
        idealFor: "Clients seeking visual clarity before construction begins",
        images: [
            { title: "Prasad Residence", src: "/Mayaakars/architect-residence/prasad-residence/06.webp" },
            { title: "Interior Visualization", src: "/Mayaakars/architect-residence/prasad-residence/07.webp" },
            { title: "Exterior Visualization", src: "/Mayaakars/architect-residence/prasad-residence/09.webp" },
            { title: "Panorama House", src: "/Mayaakars/architect-residence/panorama-house/42.webp" },
            { title: "Material Study", src: "/Mayaakars/architect-residence/panorama-house/35.webp" },
        ],
    },
    {
        slug: "execution-design-management",
        title: "Execution & Design Management",
        subtitle: "Execution",
        description:
            "From approved designs to final handover — we coordinate contractors, manage timelines, and ensure every detail is executed exactly as envisioned. Design intent is preserved from start to finish, so nothing gets lost in translation.",
        scope: [
            "Contractor coordination & vendor management",
            "Site supervision & quality control",
            "Timeline & budget management",
            "Design intent compliance checks",
            "Final handover & snagging",
        ],
        idealFor: "Clients seeking complete turnkey delivery with ongoing design oversight",
        images: [
            { title: "Skyline Commercial Hub", src: "/Mayaakars/architect-commercial/skyline-commercial-hub/22.webp" },
            { title: "Aurora Healthcare", src: "/Mayaakars/architect-commercial/aurora-healthcare/hospital-gallery-1.webp" },
            { title: "Kumar Residence", src: "/Mayaakars/interior-residencial/kumar-residence/dining-area.webp" },
            { title: "Seabreeze Office", src: "/Mayaakars/interior-commercial/seabreeze-office/office-area.webp" },
            { title: "Rathod Residence", src: "/Mayaakars/architect-residence/rathod-residence/1.webp" },
        ],
    },
];

export function getServiceBySlug(slug: string): Service | undefined {
    return SERVICES.find((s) => s.slug === slug);
}
