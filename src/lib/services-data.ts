export type Service = {
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    scope: string[];
    idealFor: string;
    images: { title: string; src: string; gallery?: string[] }[];
};

export const SERVICES: Service[] = [
    {
        slug: "architecture",
        title: "Foundation",
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
            { title: "", src: "/Mayaakars/service_Architect/front_img.webp" },
            { title: "Plans & Layout", src: "/Mayaakars/service_Architect/plans%20and%20layout.webp" },
            { title: "Early Design Thinking", src: "/Mayaakars/service_Architect/Design-Thinking-Idea-Generation-Technique.webp" },
            { title: "Site-Based Thinking", src: "/Mayaakars/service_Architect/3.%20Site-Based%20Thinking.webp" },
        ],
    },
    {
        slug: "interior-design",
        title: "Experience",
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
            { title: "Bedroom", src: "/Mayaakars/interior-residencial/kumar-residence/bedroom-2.webp", gallery: [
                "/Mayaakars/interior-residencial/Abhishek%20Ray%20%26%20Pinky%20Ray%20(%20Another%20Sky%20By%20Living%20Wall%20)/_DSC0247.webp",
                "/Mayaakars/interior-residencial/house-of-13-arches/bedroom-3-1-.webp",
                "/Mayaakars/interior-residencial/kumar-residence/bedroom-2.webp",
                "/Mayaakars/interior-residencial/patil-residence/bedroom-1.webp",
                "/Mayaakars/interior-residencial/Shesh%20(%20Secret%20Soil%20)/_DSC1939.webp",
                "/Mayaakars/interior-residencial/Visagan%20(%20Secrete%20Soil%20)/_DSC1773.webp",
            ]},
            { title: "Living Room", src: "/Mayaakars/interior-residencial/Hari%20(%20Secrete%20Soil%20)/Hero%20Image.webp", gallery: [
                "/Mayaakars/interior-residencial/Abhishek%20Ray%20%26%20Pinky%20Ray%20(%20Another%20Sky%20By%20Living%20Wall%20)/_DSC0178.webp",
                "/Mayaakars/interior-residencial/Hari%20(%20Secrete%20Soil%20)/_DSC2735.webp",
                "/Mayaakars/interior-residencial/house-of-13-arches/living-area.webp",
                "/Mayaakars/interior-residencial/kumar-residence/living-area-1-.webp",
                "/Mayaakars/interior-residencial/panorama-house/hall-.webp",
                "/Mayaakars/interior-residencial/patil-residence/living-area.webp",
            ]},
            { title: "Dining Room", src: "/Mayaakars/architect-residence/panorama-house/23.webp", gallery: [
                "/Mayaakars/interior-residencial/house-of-13-arches/dining-area.webp",
                "/Mayaakars/interior-residencial/kumar-residence/dining-area.webp",
                "/Mayaakars/interior-residencial/panorama-house/dining-room-.webp",
                "/Mayaakars/interior-residencial/patil-residence/dining-.webp",
                "/Mayaakars/interior-residencial/Shesh%20(%20Secret%20Soil%20)/b1daf05b-0b7c-4c05-af35-653bb8f797fe.webp",
            ]},
            { title: "Kitchen", src: "/Mayaakars/interior-residencial/Visagan%20(%20Secrete%20Soil%20)/_DSC1625.webp", gallery: [
                "/Mayaakars/interior-residencial/Hari%20(%20Secrete%20Soil%20)/_DSC2719.webp",
                "/Mayaakars/interior-residencial/house-of-13-arches/kitchen-.webp",
                "/Mayaakars/interior-residencial/kumar-residence/kitchen-.webp",
                "/Mayaakars/interior-residencial/panorama-house/kitchen-.webp",
                "/Mayaakars/interior-residencial/Shantanu%20Chakrvarty%20%26%20Roshni%20Saraf%20(%20Brigade%20Exotica%20)/_DSC0596.webp",
                "/Mayaakars/interior-residencial/Shesh%20(%20Secret%20Soil%20)/b9c6d3ba-e76a-4357-aec4-313c28e6f55a.webp",
            ]},
            { title: "Mandri", src: "/Mayaakars/interior-residencial/WindMills%20of%20your%20Mind/_DSC1066.webp", gallery: [
                "/Mayaakars/interior-residencial/panorama-house/puja-room-1-.webp",
                "/Mayaakars/interior-residencial/patil-residence/puja-room.webp",
                "/Mayaakars/interior-residencial/WindMills%20of%20your%20Mind/_DSC1066.webp",
                "/Mayaakars/interior-residencial/Shantanu%20Chakrvarty%20%26%20Roshni%20Saraf%20(%20Brigade%20Exotica%20)/_DSC0731.webp",
                "/Mayaakars/interior-residencial/Abhishek%20Ray%20%26%20Pinky%20Ray%20(%20Another%20Sky%20By%20Living%20Wall%20)/_DSC0347.webp",
                "/Mayaakars/interior-residencial/Shantanu%20Chakrvarty%20%26%20Roshni%20Saraf%20(%20Brigade%20Exotica%20)/_DSC0729.webp",
            ]},
            { title: "Decor", src: "/Mayaakars/interior-residencial/Shantanu%20Chakrvarty%20%26%20Roshni%20Saraf%20(%20Brigade%20Exotica%20)/_DSC0928.webp", gallery: [
                "/Mayaakars/interior-residencial/Shantanu%20Chakrvarty%20%26%20Roshni%20Saraf%20(%20Brigade%20Exotica%20)/_DSC0689.webp",
                "/Mayaakars/interior-residencial/Shantanu%20Chakrvarty%20%26%20Roshni%20Saraf%20(%20Brigade%20Exotica%20)/_DSC0812.webp",
                "/Mayaakars/interior-residencial/Visagan%20(%20Secrete%20Soil%20)/_DSC1741.webp",
                "/Mayaakars/interior-residencial/Shesh%20(%20Secret%20Soil%20)/9b333084-f942-47df-ac25-a1676bdb6f42.webp",
                "/Mayaakars/interior-residencial/Shesh%20(%20Secret%20Soil%20)/_DSC1843.webp",
                "/Mayaakars/interior-residencial/Ganesh%20Babu%20(%20Century%20Ethos%20)/3.webp",
            ]},
        ],
    },
    {
        slug: "3d-visualization",
        title: "Visualization",
        subtitle: "3D ",
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
            { title: "Rathod Residence", src: "/Mayaakars/architect-residence/rathod-residence/1.webp" },
            { title: "Rathod Residence", src: "/Mayaakars/architect-residence/rathod-residence/2.webp" },
            { title: "Skyline Commercial Hub", src: "/Mayaakars/architect-commercial/skyline-commercial-hub/img-20190327-wa0003.webp" },
            { title: "Skyline Commercial Hub", src: "/Mayaakars/architect-commercial/skyline-commercial-hub/img-20190327-wa0008.webp" },
            { title: "Skyline Commercial Hub", src: "/Mayaakars/architect-commercial/skyline-commercial-hub/mumbai-building-1.webp" },
            { title: "Prasad Residence", src: "/Mayaakars/architect-residence/prasad-residence/06.webp" },
            { title: "Prasad Residence", src: "/Mayaakars/architect-residence/prasad-residence/07.webp" },
            { title: "Prasad Residence", src: "/Mayaakars/architect-residence/prasad-residence/09.webp" },

        ],
    },
    {
        slug: "execution-design-management",
        title: "Execution",
        subtitle: "Precision",
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
            { title: "Panorama House", src: "/Mayaakars/interior-residencial/Hari%20(%20Secrete%20Soil%20)/_DSC2766.webp" },
            { title: "Panorama House", src: "/Mayaakars/architect-residence/panorama-house/05.webp" },
            { title: "Solaris Energy", src: "/Mayaakars/interior-commercial/solaris-energy/lobby-area.webp" },
            { title: "The Grid", src: "/Mayaakars/interior-commercial/the-grid/innova8-2.webp" },
            { title: "Seabreeze Office", src: "/Mayaakars/interior-commercial/seabreeze-office/lobby-area-2-.webp" },
        ],
    },
];

export function getServiceBySlug(slug: string): Service | undefined {
    return SERVICES.find((s) => s.slug === slug);
}
