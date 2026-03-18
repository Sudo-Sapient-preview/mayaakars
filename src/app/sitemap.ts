import type { MetadataRoute } from "next";

const SITE_URL = "https://www.mayaakars.com";

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

    const projectRoutes: MetadataRoute.Sitemap = [
        "residential-architecture",
        "commercial-architecture",
        "residential-interiors",
        "commercial-interior",
    ].map((slug) => ({
        url: `${SITE_URL}/projects/${slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    const serviceRoutes: MetadataRoute.Sitemap = [
        "commercial-architecture",
        "residential-interior-design",
        "commercial-interior-design",
        "space-planning-design-consultation",
        "3d-visualization-walkthroughs",
    ].map((slug) => ({
        url: `${SITE_URL}/services/${slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    return [...staticRoutes, ...projectRoutes, ...serviceRoutes];
}
