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
        slug: "commercial-architecture",
        title: "Commercial Architecture",
        subtitle: "Architecture",
        description:
            "Purpose-driven architecture designed to support business goals while expressing brand identity. We create commercial environments that are efficient, adaptable, and visually compelling — ensuring functionality without compromising on aesthetics.",
        scope: [
            "Site analysis & feasibility studies",
            "Zoning & spatial efficiency planning",
            "Architectural design & detailing",
            "Compliance-oriented drawings",
        ],
        idealFor: "Offices, retail spaces, clinics, hospitality projects",
        images: [
            { title: "Corporate Hub", src: "/Mayaakars/architect-commercial/skyline-commercial-hub/mumbai-building-1.webp" },
            { title: "Glass Facade", src: "/Mayaakars/architect-commercial/aurora-healthcare/hospital-main-2.webp" },
            { title: "Urban Complex", src: "/Mayaakars/architect-commercial/skyline-commercial-hub/25.webp" },
            { title: "Modern Office", src: "/Mayaakars/architect-commercial/aurora-healthcare/hospital-gallery-24.webp" },
            { title: "Retail Space", src: "/Mayaakars/architect-commercial/skyline-commercial-hub/24.webp" },
        ],
    },
    {
        slug: "residential-interior-design",
        title: "Residential Interior Design",
        subtitle: "Interior Design",
        description:
            "Our interior designs are rooted in comfort, character, and timeless appeal. Each space is thoughtfully curated to reflect the lifestyle and personality of its occupants while ensuring long-term functionality.",
        scope: [
            "Space planning & furniture layouts",
            "Concept development & mood boards",
            "Material, finishes & lighting selection",
            "Custom furniture & joinery detailing",
            "Design coordination & site support",
        ],
        idealFor: "Apartments, villas, renovations, turnkey interiors",
        images: [
            { title: "Living Room", src: "/Mayaakars/architect-residence/rathod-residence/2.webp" },
            { title: "Master Bedroom", src: "/Mayaakars/interior-residencial/kumar-residence/bedroom-1.webp" },
            { title: "Kitchen", src: "/Mayaakars/interior-residencial/kumar-residence/kitchen.webp" },
            { title: "Dining Area", src: "/Mayaakars/interior-residencial/kumar-residence/dining-area.webp" },
            { title: "Bath & Vanity", src: "/Mayaakars/interior-residencial/kumar-residence/vanity-table-.webp" },
        ],
    },
    {
        slug: "commercial-interior-design",
        title: "Commercial Interior Design",
        subtitle: "Interior Design",
        description:
            "Design that enhances workflow, experience, and brand presence. We design commercial interiors that balance aesthetics with operational efficiency — creating environments that support both people and purpose.",
        scope: [
            "Brand-aligned design concepts",
            "Functional zoning & layout planning",
            "Custom furniture & finish selection",
            "Vendor & site coordination",
        ],
        idealFor: "Corporate offices, retail spaces, cafes, showrooms",
        images: [
            { title: "Office Lounge", src: "/Mayaakars/interior-commercial/seabreeze-office/lobby-area-2-.webp" },
            { title: "Workspace", src: "/Mayaakars/interior-commercial/seabreeze-office/office-area.webp" },
            { title: "Showroom", src: "/Mayaakars/interior-commercial/the-grid/innova8-2.webp" },
            { title: "Café Interior", src: "/Mayaakars/interior-commercial/shizuka-nook/dining-area.webp" },
            { title: "Reception", src: "/Mayaakars/interior-commercial/solaris-energy/lobby-area.webp" },
        ],
    },
    {
        slug: "space-planning",
        title: "Space Planning & Design Consultation",
        subtitle: "Design Support",
        description:
            "Strategic planning for clients at the early stages of decision-making. This service focuses on clarity — helping you understand spatial possibilities, layouts, and design direction before moving into full-scale execution.",
        scope: [
            "Layout optimization",
            "Functional zoning",
            "Design direction & expert guidance",
        ],
        idealFor: "Clients exploring design possibilities before committing to full-scale projects",
        images: [
            { title: "Floor Plan", src: "/Mayaakars/interior-residencial/kumar-residence/dining-area.webp" },
            { title: "Blueprint", src: "/Mayaakars/constructions/gayatri-residnece-2826sqft/3d-design.webp" },
            { title: "Concept Sketch", src: "/Mayaakars/constructions/chandrashekhar-residence-4297sqft-g3/3d-design-.webp" },
            { title: "Design Review", src: "/Mayaakars/constructions/bose-residence-4963sqftsqft/3d-design.webp" },
            { title: "Model Study", src: "/Mayaakars/constructions/sharma-residence-4753sqft/3d-design.webp" },
        ],
    },
    {
        slug: "3d-visualization",
        title: "3D Visualization & Walkthroughs",
        subtitle: "Visualization",
        description:
            "Experience your space before it is built. Our photorealistic renders and immersive walkthroughs help visualize proportions, materials, and lighting — enabling confident decision-making and alignment.",
        scope: [
            "High-quality 3D renders",
            "Walkthrough videos",
            "Design intent visualization",
        ],
        idealFor: "Clients seeking visual clarity before construction begins",
        images: [
            { title: "3D Render", src: "/Mayaakars/architect-residence/prasad-residence/06.webp" },
            { title: "Interior Viz", src: "/Mayaakars/architect-residence/prasad-residence/07.webp" },
            { title: "Exterior Viz", src: "/Mayaakars/architect-residence/prasad-residence/09.webp" },
            { title: "Walkthrough", src: "/Mayaakars/architect-residence/panorama-house/42.webp" },
            { title: "Material Study", src: "/Mayaakars/architect-residence/panorama-house/35.webp" },
        ],
    },
];

export function getServiceBySlug(slug: string): Service | undefined {
    return SERVICES.find((s) => s.slug === slug);
}
