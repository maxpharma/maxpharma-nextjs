import { getSeoMetadata } from "@/utils/seo";
import ServiceContents from "./ServiceContent";
import GeneralSettings from "@/api/generalSettings";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const { slug } = params;

    const data = await GeneralSettings.getByGroup(
        "serviceCategories",
        "serviceCategories"
    );

    const seoKey = data?.find((item: any) => slug === item?.infos?.seoUrl);

    return await getSeoMetadata(seoKey?.infos?.state);
}

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = params;
    return <ServiceContents slug={slug} />;
}
