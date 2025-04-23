import { getSeoMetadata } from "@/utils/seo";
import ServiceContents from "./ServiceContent";
import GeneralSettings from "@/api/generalSettings";
import { Metadata } from "next";

export async function generateMetadata({ params }: any): Promise<Metadata> {
    const { service } = params;

    const data = await GeneralSettings.getByGroup(
        "serviceCategories",
        "serviceCategories"
    );

    const seoKey = data?.find((item: any) => service === item?.infos?.seoUrl);

    console.log("seoKey for the general settings", seoKey);

    return await getSeoMetadata(seoKey?.infos?.state);
}

export default async function Page() {
    return <ServiceContents />;
}
