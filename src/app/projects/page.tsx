import { Suspense } from "react";
import ProjectsGrid from "@/components/projects/ProjectsGrid";

export default function ProjectsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
            <ProjectsGrid />
        </Suspense>
    );
}
