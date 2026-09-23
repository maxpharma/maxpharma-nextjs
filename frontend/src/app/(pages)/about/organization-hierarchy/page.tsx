import { getSeoMetadata } from "@/utils/seo";
import OrganizationChartPage from "./OrganizationChartPage";

export async function generateMetadata() {
    return await getSeoMetadata("organizationHistorySeo");
}

const OrganizationHistoryPage = () => {
    return <OrganizationChartPage />;
};

export default OrganizationHistoryPage;
