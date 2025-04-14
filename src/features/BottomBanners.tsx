import CustomImage from "@/components/CustomImage";
import React from "react";

const BottomBanners = () => {
    const data = ["/images/bottom-banner.png"];

    return (
        <div className='flex gap-8 overflow-x-scroll'>
            {Array(10)
                .fill(data)
                .map((item, index) => (
                    <CustomImage
                        key={index}
                        src={item[0]}
                        className='min-w-xl min-h-100'
                    />
                ))}
        </div>
    );
};

export default BottomBanners;
