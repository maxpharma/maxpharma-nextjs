import { getSeoMetadata } from "@/utils/seo";
import ServiceContents from "./ServiceContent";
import GeneralSettings from "@/api/generalSettings";

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}) {
    const { slug } = params;

    const data = await GeneralSettings.getByGroup(
        "serviceCategories",
        "serviceCategories"
    );

    const seoKey = data?.find((item: any) => slug === item?.infos?.seoUrl);

    return await getSeoMetadata(seoKey?.infos?.state);
}

const ServicePages = ({ params }: { params: { slug: string } }) => {
    const { slug } = params;
    return <ServiceContents slug={slug} />;
};

export default ServicePages;
