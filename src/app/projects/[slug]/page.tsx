import { notFound } from "next/navigation";
import type { Metadata } from "next";
import manifest from "@/data/gallery-manifest.json";
import ProjectDetail from "./ProjectDetail";

type Project = {
    id: string;
    title: string;
    category: string;
    coverImage: string;
    images: string[];
};

const ALL_PROJECTS = manifest as Project[];

export function generateStaticParams() {
    return ALL_PROJECTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const project = ALL_PROJECTS.find((p) => p.id === slug);
    if (!project) return {};
    return {
        title: `${project.title} | Mayaakars`,
        description: `Explore the ${project.title} project by Mayaakars.`,
    };
}

export default async function ProjectPage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const project = ALL_PROJECTS.find((p) => p.id === slug);
    if (!project) notFound();

    return <ProjectDetail project={project} />;
}
