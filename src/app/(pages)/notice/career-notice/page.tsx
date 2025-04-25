import ScrollReveal from "@/components/animation/ScrollReveal";
import Notices from "@/features/Notices";
import { getSeoMetadata } from "@/utils/seo";
import React from "react";

export async function generateMetadata() {
    return await getSeoMetadata("noticeSeo");
}

const page = () => {
    return (
        <ScrollReveal>
            <div>
                <Notices limit={9} />
            </div>
        </ScrollReveal>
    );
};

export default page;
