"use client";

import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Button from "./Button";

interface BannerProps {
    autoSlide?: boolean;
    autoSlideInterval?: number;
}

const Banner: React.FC<BannerProps> = ({
    autoSlide = true,
    autoSlideInterval = 5000,
}) => {
    const currentBanner = true;

    // Simple array of image paths
    const bannerImages = [
        "/images/banner4.png",
        "/images/banner.png",
        // Add more banner images as needed
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [direction, setDirection] = useState(1); // 1 for right, -1 for left

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, [bannerImages.length]);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1
        );
    }, [bannerImages.length]);

    const goToSlide = (index: number) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    };

    useEffect(() => {
        if (!autoSlide || isPaused) return;

        const slideInterval = setInterval(nextSlide, autoSlideInterval);

        return () => clearInterval(slideInterval);
    }, [autoSlide, isPaused, nextSlide, autoSlideInterval]);

    // Variants for slide animations
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction > 0 ? "-100%" : "100%",
            opacity: 0,
        }),
    };

    return (
        <div
            className='relative h-[180px] md:h-[350px] lg:h-[450px] xl:h-[550px] 2xl:h-[600px] w-full max-w-[96vw] mx-auto overflow-hidden rounded-xl'
            onMouseEnter={() => {
                setIsHovering(true);
                setIsPaused(true);
            }}
            onMouseLeave={() => {
                setIsHovering(false);
                setIsPaused(false);
            }}
        >
            <div className='absolute inset-0'>
                <AnimatePresence initial={false} custom={direction} mode='sync'>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial='enter'
                        animate='center'
                        exit='exit'
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                        }}
                        className='absolute inset-0'
                    >
                        <Image
                            src={bannerImages[currentIndex]}
                            alt={`Banner image ${currentIndex + 1}`}
                            fill
                            className='object-cover rounded-xl'
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Indicators */}
            <div className='absolute bottom-4 left-0 right-0'>
                <div className='flex gap-2 justify-center'>
                    {bannerImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                                index === currentIndex
                                    ? "bg-white w-4"
                                    : "bg-white/50"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
                <div>
                    <div className='absolute bottom-4 left-4 lg:bottom-8 lg:left-8 flex flex-col gap-2 md:gap-4 z-10 p-4 rounded-lg'>
                        <span className='text-base text-white font-bold md:text-xl lg:text-2xl xl:text-3xl'>
                            &quot;Banner Title&quot;
                        </span>

                        <Link href={"/"} passHref>
                            <Button>Learn More</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;

// {currentBanner && (
//     <div className='absolute bottom-4 left-4 lg:bottom-8 lg:left-8 flex flex-col gap-2 md:gap-4 z-10 p-4 rounded-lg'>
//         <span className='text-base text-white font-bold md:text-xl lg:text-2xl xl:text-3xl'>
//             {currentBanner.title || "Banner Title"}
//         </span>
//         {currentBanner.link && (
//             <Link href={currentBanner.link} passHref>
//                 <Button>Learn More</Button>
//             </Link>
//         )}
//     </div>
// )}
