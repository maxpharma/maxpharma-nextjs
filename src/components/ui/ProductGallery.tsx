// ProductGallery.tsx
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
    images: {
        src: string;
        alt: string;
    }[];
}

const ProductGallery = ({ images }: ProductGalleryProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    const handlePrevious = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleThumbnailHover = (index: number) => {
        setCurrentImageIndex(index);
    };

    return (
        <div className='w-full'>
            <div className='flex flex-col md:flex-row gap-4'>
                {/* Thumbnails - Left side on md+ screens, top on small screens */}
                <div className='flex md:flex-col justify-center items-center md:w-20 order-2 md:order-1 space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0'>
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`relative flex-shrink-0 cursor-pointer w-12 h-12 sm:w-16 sm:h-16 border-2 ${
                                currentImageIndex === index
                                    ? "border-gray-500"
                                    : "border-transparent"
                            }`}
                            onMouseEnter={() => handleThumbnailHover(index)}
                            onClick={() => setCurrentImageIndex(index)}
                        >
                            <Image
                                src={image.src}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className='object-cover'
                            />
                        </div>
                    ))}
                </div>

                {/* Main Image */}
                <div
                    className='relative order-1 md:order-2 md:flex-1'
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <div
                        className='relative mx-auto 
                         min-h-72 max-h-100 min-w-72 max-w-100
                         sm:min-h-72 sm:max-h-100 sm:min-w-72 sm:max-w-100 
                         md:min-h-100 md:max-h-[150px] md:min-w-100 md:max-w-[150px] 
                         lg:min-h-100 lg:max-h-150 lg:min-w-100 lg:max-w-150'
                    >
                        <Image
                            src={images[currentImageIndex].src}
                            alt={images[currentImageIndex].alt}
                            fill
                            className='object-contain'
                            priority
                        />
                    </div>

                    {/* Navigation Arrows - visible on hover */}
                    {isHovering && (
                        <>
                            <button
                                onClick={handlePrevious}
                                className='absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 shadow-md hover:bg-white transition-all'
                                aria-label='Previous image'
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={handleNext}
                                className='absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 shadow-md hover:bg-white transition-all'
                                aria-label='Next image'
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductGallery;
