"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

const BottomBanners: React.FC = () => {
    const data: string[] = [
        "/images/bottom-banner.png",
        "/images/bottom-banner-1.png",
        "/images/bottom-banner-2.png",
        "/images/bottom-banner-3.png",
        "/images/bottom-banner-5.png",
        "/images/bottom-banner-6.png",
        "/images/bottom-banner-7.png",
        "/images/bottom-banner-8.png",
        "/images/bottom-banner-9.png",
        "/images/bottom-banner-10.png",
        "/images/bottom-banner-11.png",
    ];

    // Duplicate the array for seamless looping
    const images = [...data, ...data];

    // Fixed height for all images
    const IMAGE_HEIGHT = 400; // px

    // Refs
    const scrollerRef = useRef<HTMLDivElement | null>(null);
    const animationRef = useRef<gsap.core.Tween | null>(null);
    const isDragging = useRef<boolean>(false);
    const startX = useRef<number>(0);
    const scrollLeft = useRef<number>(0);
    const totalWidthRef = useRef<number>(0);

    // Calculate total width and setup animation after images are loaded
    useEffect(() => {
        const calculateTotalWidth = () => {
            if (!scrollerRef.current) return;

            // Get the actual width after images have rendered
            const containerWidth = scrollerRef.current.scrollWidth / 2; // Divide by 2 because we duplicated the array
            totalWidthRef.current = containerWidth;

            // Reset any existing animation
            if (animationRef.current) {
                animationRef.current.kill();
            }

            // Create the animation with the calculated width
            animationRef.current = gsap.to(scrollerRef.current, {
                x: -containerWidth,
                duration: 60,
                ease: "none",
                repeat: -1,
                repeatDelay: 0,
                onRepeat: () => {
                    gsap.set(scrollerRef.current, { x: 0 });
                },
            });
        };

        // Set a timeout to ensure images have loaded and DOM has been painted
        const timer = setTimeout(calculateTotalWidth, 500);

        return () => {
            clearTimeout(timer);
            if (animationRef.current) {
                animationRef.current.kill();
            }
        };
    }, []);

    // Mouse handlers for pausing/resuming animation
    const handleMouseEnter = () => {
        if (animationRef.current) {
            animationRef.current.pause();
        }
    };

    const handleMouseLeave = () => {
        if (animationRef.current && !isDragging.current) {
            animationRef.current.play();
        }
    };

    // Mouse down handler for dragging
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!scrollerRef.current) return;
        isDragging.current = true;
        startX.current = e.pageX - scrollerRef.current.offsetLeft;
        scrollLeft.current = Number(gsap.getProperty(scrollerRef.current, "x"));

        document.addEventListener(
            "mousemove",
            handleMouseMove as EventListener
        );
        document.addEventListener("mouseup", handleMouseUp as EventListener);
    };

    // Mouse move handler for dragging
    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current || !scrollerRef.current) return;

        const x = e.pageX - scrollerRef.current.offsetLeft;
        const walk = x - startX.current;

        // Update position via GSAP
        gsap.set(scrollerRef.current, {
            x: scrollLeft.current + walk,
        });
    };

    // Mouse up handler for ending drag
    const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener(
            "mousemove",
            handleMouseMove as EventListener
        );
        document.removeEventListener("mouseup", handleMouseUp as EventListener);

        // Resume animation after a short delay to make it smoother
        setTimeout(() => {
            if (scrollerRef.current && !scrollerRef.current.matches(":hover")) {
                if (animationRef.current) {
                    animationRef.current.play();
                }
            }
        }, 100);
    };

    return (
        <div
            className='relative w-full overflow-hidden'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={scrollerRef}
                className='flex gap-8 cursor-grab active:cursor-grabbing'
                onMouseDown={handleMouseDown}
                style={{ touchAction: "none" }}
            >
                {images.map((item, index) => (
                    <div key={index} className='flex-shrink-0'>
                        <div
                            style={{ height: `${IMAGE_HEIGHT}px` }}
                            className='flex items-center justify-center'
                        >
                            <Image
                                src={item}
                                alt={`Bottom Banner ${index}`}
                                width={0}
                                height={IMAGE_HEIGHT}
                                style={{
                                    height: `${IMAGE_HEIGHT}px`,
                                    width: "auto",
                                    objectFit: "contain",
                                    borderRadius: "8px",
                                }}
                                unoptimized
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BottomBanners;
