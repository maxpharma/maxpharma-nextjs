import { getSeoMetadata } from "@/utils/seo";
import ServiceContents from "./ServiceContent";
import GeneralSettings from "@/api/generalSettings";
import { Metadata } from "next";
import ScrollReveal from "@/components/animation/ScrollReveal";

export async function generateMetadata({ params }: any): Promise<Metadata> {
    try {
        const resolvedParams = await params;
        const service = resolvedParams?.service;

        const data = await GeneralSettings.getByGroup(
            "serviceCategories",
            "serviceCategories"
        );

        const seoKey = data?.find((item: any) => service === item?.infos?.seoUrl);

        return await getSeoMetadata(seoKey?.infos?.state);
    } catch (error) {
        return await getSeoMetadata("");
    }
}

export default async function Page() {
    return (
        <ScrollReveal>
            <ServiceContents />
        </ScrollReveal>
    );
}
