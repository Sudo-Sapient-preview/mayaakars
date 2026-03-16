import { NextResponse } from "next/server";
import { scanProjects } from "@/lib/projects-scanner";

// Always scan fresh — no stale cache between deploys
export const dynamic = "force-dynamic";

export async function GET() {
    const projects = scanProjects();
    return NextResponse.json(projects);
}
