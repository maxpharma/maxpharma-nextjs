import Notices from "@/features/Notices";
import { getSeoMetadata } from "@/utils/seo";
import React from "react";

export async function generateMetadata() {
    return await getSeoMetadata("noticeSeo");
}

const page = () => {
    return (
        <div>
            <Notices limit={9} variant='job' />
        </div>
    );
};

export default page;
