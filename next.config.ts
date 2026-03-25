import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    poweredByHeader: false,
    compress: true,
    output: "standalone",

    images: {
        formats: ["image/avif", "image/webp"],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
        deviceSizes: [640, 768, 1024, 1280, 1920],
        imageSizes: [64, 128, 256, 384, 512],
    },

    async headers() {
        return [
            // Security headers on every route
            {
                source: "/(.*)",
                headers: [
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "X-Frame-Options", value: "DENY" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                ],
            },
            // Long-lived cache for static assets
            {
                source: "/Mayaakars/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            {
                source: "/gallery/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            {
                source: "/3d_scroll/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
