"use client";

import ServiceContents from "@/features/ServiceContents";

export default function Page({ params }: { params: { slug: string } }) {
    return <ServiceContents id={params.slug} />;
}
