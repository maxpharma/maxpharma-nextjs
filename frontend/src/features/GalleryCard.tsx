"use client";

import Image from "next/image";
import React from "react";

interface GalleryCardProps {
    images: string[];
}

const GalleryCard = ({ images }: GalleryCardProps) => {
    // const images = ["/images/banner4.png", "/images/bottom-banner.png"];

    return (
        <div className='relative w-full h-64 md:h-80'>
            {/* First image - top left with shadow */}
            <div className='absolute top-0 left-0 w-3/5 h-3/5 rounded-lg overflow-hidden shadow-lg transform rotate-[-2deg]'>
                <div className='relative w-full h-full border-8 border-white rounded-lg overflow-hidden'>
                    <Image
                        src={images[0] || "/images/placeholder.png"}
                        alt='Company Building'
                        fill
                        className='object-cover rounded-sm'
                        placeholder='blur'
                        blurDataURL='/images/placeholder.png'
                    />
                </div>
            </div>

            {/* Second image - bottom right, overlapping */}
            <div className='absolute bottom-0 right-0 w-3/5 h-3/5 rounded-lg overflow-hidden shadow-lg transform rotate-[1deg] bg-white'>
                <div className='relative w-full h-full border-8 border-white rounded-lg overflow-hidden'>
                    <Image
                        src={images[1] || "/images/placeholder.png"}
                        alt='Company Team'
                        fill
                        placeholder='blur'
                        blurDataURL='/images/placeholder.png'
                        className='object-cover rounded-sm'
                    />
                </div>
            </div>
        </div>
    );
};

export default GalleryCard;
