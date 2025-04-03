'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import GeneralSettings from '@/api/generalSettings';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const Banner = () => {
    const [index, setIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(0);

    const { data: banners } = useSelector((state: any) => state.banners);

    const fetchBanner = async () => {
        try {
            await GeneralSettings.getByGroup('banners', 'banner', '');
        } catch (error) {
            console.error('Failed to fetch banners:', error);
        }
    };

    useEffect(() => {
        if (!banners?.length) fetchBanner();
    }, [banners?.length]);

    // Merged banner data with image URL
    const bannerData = (banners || [])
        .map((banner: any) => {
            const imageUrl = banner?.file
                ? `${process.env.NEXT_PUBLIC_BUCKET_URL as string}/${
                      banner.file
                  }`
                : '';
            return imageUrl
                ? {
                      title: banner.title,
                      link: banner.value,
                      imageUrl,
                  }
                : null;
        })
        .filter(Boolean); // Remove any null values

    useEffect(() => {
        if (bannerData.length === 0) return;

        const interval = setInterval(() => {
            setPrevIndex(index);
            setIndex((prev) => (prev + 1) % bannerData.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [index, bannerData.length]);

    const currentBanner = bannerData[index] || null;
    const prevBanner = bannerData[prevIndex] || null;

    return (
        <div className='relative h-[180px] md:h-[350px] lg:h-[450px] xl:h-[550px] 2xl:h-[600px] w-full max-w-[96vw] mx-auto overflow-hidden rounded-xl'>
            {/* Previous Image */}
            {prevBanner && (
                <Image
                    src={prevBanner.imageUrl}
                    alt={prevBanner.title || 'banner'}
                    fill
                    className='object-cover rounded-xl absolute inset-0'
                    priority={prevIndex === 0}
                />
            )}

            {/* Sliding Image */}
            {currentBanner && (
                <motion.div
                    key={index}
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className='absolute inset-0'
                >
                    <Image
                        src={currentBanner.imageUrl}
                        alt={currentBanner.title || 'banner'}
                        fill
                        className='object-cover rounded-xl'
                    />
                </motion.div>
            )}

            {/* Dynamic Title and Button */}
            {currentBanner && (
                <div className='absolute bottom-4 left-4 lg:bottom-8 lg:left-8 flex flex-col gap-2 md:gap-4 z-10 p-4 rounded-lg'>
                    <span className='text-base text-white font-bold md:text-xl lg:text-2xl xl:text-3xl'>
                        {currentBanner.title || 'Banner Title'}
                    </span>
                    {currentBanner.link && (
                        <Link href={currentBanner.link} passHref>
                            <Button>Learn More</Button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default Banner;
