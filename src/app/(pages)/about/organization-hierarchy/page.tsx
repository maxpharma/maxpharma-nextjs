import { getSeoMetadata } from "@/utils/seo";
import OrganizationChartPage from "./OrganizationChartPage";
import ScrollReveal from "@/components/animation/ScrollReveal";

export async function generateMetadata() {
    return await getSeoMetadata("organizationHistorySeo");
}

const OrganizationHistoryPage = () => {
    return <OrganizationChartPage />;
};

export default OrganizationHistoryPage;
