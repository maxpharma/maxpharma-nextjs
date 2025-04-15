"use client";

import CustomImage from "@/components/CustomImage";
import React from "react";

const BottomBanners = () => {
    const data = [
        "/images/bottom-banner.png",
        "/images/bottom-banner-1.png",
        "/images/bottom-banner-2.png",
        "/images/bottom-banner-3.png",
        "/images/bottom-banner-4.png",
        "/images/bottom-banner-5.png",
        "/images/bottom-banner-6.png",
    ];

    return (
        <div className='flex gap-4 overflow-x-scroll'>
            {data.map((item, index) => (
                <div key={index} className='flex-shrink-0'>
                    <CustomImage
                        src={item}
                        className='min-w-xl min-h-100'
                        fit='cover'
                    />
                </div>
            ))}
        </div>
    );
};

export default BottomBanners;
