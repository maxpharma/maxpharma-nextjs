import GeneralSettings from "@/api/generalSettings";
import { Metadata } from "next";

export const getSeoMetadata = async (key: string): Promise<Metadata> => {
    const data = await GeneralSettings.getByKey("seo", key);

    return {
        title: data?.infos?.title || "Max Pharma",
        description: data?.infos?.description,
        keywords: data?.infos?.keywords,
        icons: {
            icon: "/favicon.ico",
            apple: "/favicon.ico",
            shortcut: "/favicon.ico",
        },
        openGraph: {
            title: data?.infos?.title || "Max Pharma",
            description: data?.infos?.description,
            url: process.env.NEXT_PUBLIC_BASE_URL || "https://maxpharma.com.np",
            siteName: "Max Pharma",
            images: [
                {
                    url: "/favicon.ico",
                    width: 800,
                    height: 600,
                    alt: "Max Pharma",
                },
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: data?.infos?.title || "Max Pharma",
            description: data?.infos?.description,
            images: ["/favicon.ico"],
        },
    };
};
