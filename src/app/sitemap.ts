import type { MetadataRoute } from "next";
import manifest from "@/data/gallery-manifest.json";
import { SERVICES } from "@/lib/services-data";
import { SITE_URL } from "@/lib/site";

type ProjectRoute = {
    id: string;
};

const projectRoutes = manifest as ProjectRoute[];

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: SITE_URL, lastModified: now, changeFrequency: "monthly", priority: 1 },
        { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
        { url: `${SITE_URL}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
        { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
        { url: `${SITE_URL}/journal`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
        { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
        { url: `${SITE_URL}/careers`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
        { url: `${SITE_URL}/gallery`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ];

    const projectDetailRoutes: MetadataRoute.Sitemap = projectRoutes.map((project) => ({
        url: `${SITE_URL}/projects/${project.id}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((service) => ({
        url: `${SITE_URL}/services/${service.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    return [...staticRoutes, ...projectDetailRoutes, ...serviceRoutes];
}
