"use client";

import AboutUsApi from "@/api/aboutUs";
import React from "react";
import { useSelector } from "react-redux";
import GalleryCard from "./GalleryCard";
import { bucketUrl } from "./data";

const AboutUs = () => {
    const { items: aboutUsData } = useSelector(
        (state: any) => state.aboutUsOverview || []
    );

    const fetchData = async () => {
        await AboutUsApi.get("aboutUsOverview", "Overview");
    };

    React.useEffect(() => {
        if (!aboutUsData?.length) {
            fetchData();
        }
    }, [aboutUsData?.length]);

    const title = aboutUsData?.[0]?.title || "About Max Pharma";
    const description =
        aboutUsData?.[0]?.description ||
        "Max Pharma is a premier pharmaceutical company committed to delivering safe, effective, and high-quality healthcare products across Nepal. We focus on modern manufacturing excellence, continuous innovation, and trusted partnerships.";
    const images =
        aboutUsData?.[0]?.files?.length > 0
            ? aboutUsData[0].files.map((image: any) => `${bucketUrl}/${image}`)
            : ["/images/medicine.png", "/images/ad-banner.png"];

    return (
        <section className='space-y-4 mb-8'>
            <div className='flex flex-col lg:flex-row gap-4 lg:gap-12 lg:items-center'>
                <div className='space-y-2 md:space-y-6 lg:w-6/10'>
                    <h1>{title}</h1>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: description,
                        }}
                        className='space-y-4'
                    />
                </div>

                {/* Gallery card with proper spacing */}
                <div className='lg:w-4/10 lg:mt-0'>
                    <GalleryCard images={images} />
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
