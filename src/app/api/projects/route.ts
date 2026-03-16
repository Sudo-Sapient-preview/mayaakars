import { NextResponse } from "next/server";
import projectsData from "@/lib/generated-projects.json";

// Always return fresh data — no stale cache between deploys
export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json(projectsData);
}
