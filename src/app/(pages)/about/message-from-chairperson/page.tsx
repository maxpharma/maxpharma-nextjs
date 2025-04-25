import { getSeoMetadata } from "@/utils/seo";
import MessageContent from "./MessageContent";
import ScrollReveal from "@/components/animation/ScrollReveal";

export async function generateMetadata() {
    return await getSeoMetadata("messageFromChairmanSeo");
}

const page = () => {
    return (
        <ScrollReveal>
            <MessageContent />
        </ScrollReveal>
    );
};

export default page;
