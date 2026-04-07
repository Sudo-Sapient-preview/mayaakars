import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { SERVICES, getServiceBySlug } from "@/lib/services-data";

export function generateStaticParams() {
    return SERVICES.map((service) => ({
        slug: service.slug,
    }));
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const service = getServiceBySlug(slug);

    if (!service) {
        return {};
    }

    return {
        title: `${service.subtitle} | Mayaakars`,
        description: service.description,
    };
}

export default async function ServicePage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const service = getServiceBySlug(slug);

    if (!service) {
        notFound();
    }

    return <ServiceDetailPage service={service} />;
}
