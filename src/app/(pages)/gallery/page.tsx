"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Gallery from "@/api/gallery";
import { useSelector } from "react-redux";

type GalleryImage = {
    id: number;
    galleryId: number;
    file: string;
};

// Simplified types
type GalleryItem = {
    id: number;
    title: string;
    createdAt: string;
    updatedAt: string;
    files: string[]; // files is an array of strings (file paths)
};

type LightboxImage = {
    src: string;
    alt: string;
    galleryId: number;
};

const PhotoGallery: React.FC = () => {
    const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<LightboxImage | null>(
        null
    );
    const [currentGalleryImages, setCurrentGalleryImages] = useState<
        LightboxImage[]
    >([]);
    const [touchStart, setTouchStart] = useState<number>(0);
    const [touchEnd, setTouchEnd] = useState<number>(0);

    const { items: galleryData } = useSelector((state: any) => state.gallery);

    const fetchData = async () => {
        await Gallery.getImage("gallery");
    };

    useEffect(() => {
        if (!galleryData?.length) {
            fetchData();
        }
    }, [galleryData]);

    // Transform gallery image data to the format needed for the lightbox
    // Use 'any' for galleryItem if you want to avoid strict typing
    const getGalleryImagesForLightbox = (galleryItem: any): LightboxImage[] => {
        return (galleryItem.files || []).map((file: string, idx: number) => ({
            src: `${process.env.NEXT_PUBLIC_BUCKET_URL}/${file}`,
            alt: `${galleryItem.title} - Image ${idx + 1}`,
            galleryId: galleryItem.id,
        }));
    };

    // Helper function to get the full image URL
    const getImageUrl = (imagePath: string): string => {
        return `${process.env.NEXT_PUBLIC_BUCKET_URL}/${imagePath}`;
    };

    const openLightbox = (
        image: LightboxImage,
        galleryItem: GalleryItem
    ): void => {
        setSelectedImage(image);
        setCurrentGalleryImages(getGalleryImagesForLightbox(galleryItem));
        setLightboxOpen(true);
        // Prevent scrolling when lightbox is open
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = (): void => {
        setLightboxOpen(false);
        setSelectedImage(null);
        setCurrentGalleryImages([]);
        // Restore scrolling
        document.body.style.overflow = "auto";
    };

    // Handle navigating through images in the lightbox
    const navigate = (direction: "prev" | "next"): void => {
        if (!selectedImage || currentGalleryImages.length === 0) return;

        const currentIndex = currentGalleryImages.findIndex(
            (photo) => photo.src === selectedImage.src
        );
        let newIndex: number;

        if (direction === "next") {
            newIndex = (currentIndex + 1) % currentGalleryImages.length;
        } else {
            newIndex =
                (currentIndex - 1 + currentGalleryImages.length) %
                currentGalleryImages.length;
        }

        setSelectedImage(currentGalleryImages[newIndex]);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (!lightboxOpen) return;

        switch (e.key) {
            case "ArrowLeft":
                navigate("prev");
                break;
            case "ArrowRight":
                navigate("next");
                break;
            case "Escape":
                closeLightbox();
                break;
            default:
                break;
        }
    };

    // Handle touch events for mobile swipe
    const handleTouchStart = (e: React.TouchEvent): void => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent): void => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = (): void => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            navigate("next");
        } else if (isRightSwipe) {
            navigate("prev");
        }

        // Reset values
        setTouchStart(0);
        setTouchEnd(0);
    };

    // Format date for display
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div
            className='container mx-auto px-4 py-8'
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            {galleryData && galleryData.length > 0 ? (
                galleryData.map((galleryItem: GalleryItem) => (
                    <div key={galleryItem.id} className='mb-16'>
                        <h1 className='text-3xl font-bold mb-4 text-center'>
                            {galleryItem.title}
                        </h1>
                        <p className='text-gray-500 text-center mb-6'>
                            {formatDate(galleryItem.createdAt)}
                        </p>

                        {/* Gallery Grid for each category */}
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8'>
                            {galleryItem.files.map((file, index) => {
                                const imageUrl = getImageUrl(file);

                                return (
                                    <div
                                        key={file}
                                        className='cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300'
                                        onClick={() =>
                                            openLightbox(
                                                {
                                                    src: imageUrl,
                                                    alt: `${
                                                        galleryItem.title
                                                    } - Image ${index + 1}`,
                                                    galleryId: galleryItem.id,
                                                },
                                                galleryItem
                                            )
                                        }
                                    >
                                        <div className='relative w-full h-64'>
                                            <Image
                                                src={imageUrl}
                                                alt={`${
                                                    galleryItem.title
                                                } - Image ${index + 1}`}
                                                fill
                                                className='object-cover hover:scale-105 transition-transform duration-300'
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            ) : (
                <div className='text-center py-16'>
                    <p className='text-xl text-gray-500'>
                        Loading gallery data...
                    </p>
                </div>
            )}

            {/* Lightbox Overlay */}
            {lightboxOpen && selectedImage && (
                <div className='fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center'>
                    {/* Image container */}
                    <div
                        className='relative h-full w-full md:h-4/5 md:w-4/5 flex justify-center items-center'
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Close button */}
                        <div className='absolute top-4 right-4 z-10'>
                            <button
                                onClick={closeLightbox}
                                className='bg-black bg-opacity-50 text-white hover:text-gray-300 focus:outline-none p-2 rounded-full cursor-pointer'
                                aria-label='Close lightbox'
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Image */}
                        <div className='relative h-full w-full md:h-5/6 md:w-5/6'>
                            <Image
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                fill
                                className='object-contain'
                                priority
                            />
                        </div>

                        {/* Navigation buttons */}
                        <div className='absolute left-1 sm:left-4 md:left-8 z-10'>
                            <button
                                onClick={() => navigate("prev")}
                                className='bg-black bg-opacity-50 text-white hover:text-gray-300 focus:outline-none p-2 rounded-full cursor-pointer'
                                aria-label='Previous image'
                            >
                                <ChevronLeft size={28} />
                            </button>
                        </div>

                        <div className='absolute right-1 sm:right-4 md:right-8 z-10'>
                            <button
                                onClick={() => navigate("next")}
                                className='bg-black bg-opacity-50 text-white hover:text-gray-300 focus:outline-none p-2 rounded-full cursor-pointer'
                                aria-label='Next image'
                            >
                                <ChevronRight size={28} />
                            </button>
                        </div>

                        {/* Image counter */}
                        <div className='absolute bottom-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded'>
                            {currentGalleryImages.findIndex(
                                (photo) => photo.src === selectedImage.src
                            ) + 1}{" "}
                            / {currentGalleryImages.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoGallery;
