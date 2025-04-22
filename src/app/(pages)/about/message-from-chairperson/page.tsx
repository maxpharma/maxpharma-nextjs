import { getSeoMetadata } from "@/utils/seo";
import MessageContent from "./MessageContent";

export async function generateMetadata() {
    return await getSeoMetadata("messageFromChairmanSeo");
}

const page = () => {
    return <MessageContent />;
};

export default page;
