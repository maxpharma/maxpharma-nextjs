import Image from "next/image";
import React from "react";

const GalleryCard = () => {
    return (
        <div className='relative w-full h-64 md:h-80'>
            {/* First image - top left with shadow */}
            <div className='absolute top-0 left-0 w-3/4 h-3/4 rounded-lg overflow-hidden shadow-lg transform rotate-[-2deg]'>
                <div className='relative w-full h-full'>
                    <Image
                        src='/images/banner4.png'
                        alt='Company Building'
                        fill
                        className='object-cover rounded-lg border-8 border-white'
                    />
                </div>
            </div>

            {/* Second image - bottom right, overlapping */}
            <div className='absolute bottom-0 right-0 w-3/4 h-3/4 rounded-lg overflow-hidden shadow-lg transform rotate-[1deg]'>
                <div className='relative w-full h-full'>
                    <Image
                        src='/images/banner.png'
                        alt='Company Team'
                        fill
                        className='object-cover rounded-lg border-8 border-white'
                    />
                </div>
            </div>
        </div>
    );
};

export default GalleryCard;
