import { getSeoMetadata } from "@/utils/seo";
import React from "react";

export async function generateMetadata() {
    return await getSeoMetadata("contactSeo");
}

const layout = ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>;
};

export default layout;
