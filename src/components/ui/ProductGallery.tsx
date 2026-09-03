import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import helpers from "@/utils/helper";
import {
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronDown,
} from "lucide-react";

interface ProductGalleryProps {
    images: {
        src: string;
        alt: string;
    }[];
}

const ProductGallery = ({ images }: ProductGalleryProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [showScrollButtons, setShowScrollButtons] = useState({
        top: false,
        bottom: false,
        left: false,
        right: false,
    });

    const thumbnailContainerRef = useRef<HTMLDivElement>(null);

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

    // Check if scrolling is needed and which buttons to show
    useEffect(() => {
        const checkScrollable = () => {
            const container = thumbnailContainerRef.current;
            if (!container) return;

            // For mobile (horizontal scrolling)
            const hasHorizontalOverflow =
                container.scrollWidth > container.clientWidth;
            const isScrolledRight =
                container.scrollLeft + container.clientWidth >=
                container.scrollWidth - 10;
            const isScrolledLeft = container.scrollLeft <= 10;

            // For desktop (vertical scrolling)
            const hasVerticalOverflow =
                container.scrollHeight > container.clientHeight;
            const isScrolledBottom =
                container.scrollTop + container.clientHeight >=
                container.scrollHeight - 10;
            const isScrolledTop = container.scrollTop <= 10;

            setShowScrollButtons({
                top: hasVerticalOverflow && !isScrolledTop,
                bottom: hasVerticalOverflow && !isScrolledBottom,
                left: hasHorizontalOverflow && !isScrolledLeft,
                right: hasHorizontalOverflow && !isScrolledRight,
            });
        };

        // Initial check
        checkScrollable();

        // Add event listener for scroll
        const container = thumbnailContainerRef.current;
        if (container) {
            container.addEventListener("scroll", checkScrollable);
            window.addEventListener("resize", checkScrollable);
        }

        return () => {
            if (container) {
                container.removeEventListener("scroll", checkScrollable);
                window.removeEventListener("resize", checkScrollable);
            }
        };
    }, [images.length]);

    // Scroll functions
    const scrollUp = () => {
        if (thumbnailContainerRef.current) {
            thumbnailContainerRef.current.scrollTop -= 100;
        }
    };

    const scrollDown = () => {
        if (thumbnailContainerRef.current) {
            thumbnailContainerRef.current.scrollTop += 100;
        }
    };

    const scrollLeft = () => {
        if (thumbnailContainerRef.current) {
            thumbnailContainerRef.current.scrollLeft -= 100;
        }
    };

    const scrollRight = () => {
        if (thumbnailContainerRef.current) {
            thumbnailContainerRef.current.scrollLeft += 100;
        }
    };

    // Scroll to make active thumbnail visible
    useEffect(() => {
        if (thumbnailContainerRef.current) {
            const container = thumbnailContainerRef.current;
            const activeThumb = container.children[
                currentImageIndex
            ] as HTMLElement;

            if (activeThumb) {
                // For horizontal scrolling (mobile)
                if (window.innerWidth < 768) {
                    const containerLeft = container.scrollLeft;
                    const containerRight =
                        containerLeft + container.clientWidth;
                    const thumbLeft = activeThumb.offsetLeft;
                    const thumbRight = thumbLeft + activeThumb.clientWidth;

                    if (thumbLeft < containerLeft) {
                        container.scrollLeft = thumbLeft - 10;
                    } else if (thumbRight > containerRight) {
                        container.scrollLeft =
                            thumbRight - container.clientWidth + 10;
                    }
                }
                // For vertical scrolling (desktop)
                else {
                    const containerTop = container.scrollTop;
                    const containerBottom =
                        containerTop + container.clientHeight;
                    const thumbTop = activeThumb.offsetTop;
                    const thumbBottom = thumbTop + activeThumb.clientHeight;

                    if (thumbTop < containerTop) {
                        container.scrollTop = thumbTop - 10;
                    } else if (thumbBottom > containerBottom) {
                        container.scrollTop =
                            thumbBottom - container.clientHeight + 10;
                    }
                }
            }
        }
    }, [currentImageIndex]);

    return (
        <div className='w-full'>
            <div className='flex flex-col md:flex-row gap-4'>
                {/* Thumbnails Container */}
                <div className='relative md:w-20 order-2 md:order-1'>
                    {/* Scroll buttons for vertical layout (desktop) */}
                    {showScrollButtons.top && (
                        <button
                            onClick={scrollUp}
                            className='absolute top-0 left-1/2 -translate-x-1/2 z-10 bg-white/70 rounded-full p-1 shadow-md hover:bg-white transition-all hidden md:flex'
                            aria-label='Scroll up'
                        >
                            <ChevronUp size={16} />
                        </button>
                    )}

                    {/* Scroll buttons for horizontal layout (mobile) */}
                    {showScrollButtons.left && (
                        <button
                            onClick={scrollLeft}
                            className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/70 rounded-full p-1 shadow-md hover:bg-white transition-all md:hidden'
                            aria-label='Scroll left'
                        >
                            <ChevronLeft size={16} />
                        </button>
                    )}

                    {/* Thumbnails */}
                    <div
                        ref={thumbnailContainerRef}
                        className='flex md:flex-col justify-start items-center h-20 md:h-[360px] md:max-h-[360px] space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-thin'
                        style={{ scrollBehavior: "smooth" }}
                    >
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className={`relative flex-shrink-0 cursor-pointer w-16 h-16 border-2 ${
                                    currentImageIndex === index
                                        ? "border-gray-500 rounded-sm"
                                        : "border-transparent"
                                }`}
                                onMouseEnter={() => handleThumbnailHover(index)}
                                onClick={() => setCurrentImageIndex(index)}
                            >
                                <Image
                                    src={helpers.getFileUrl(image.src)}
                                    alt={`Thumbnail ${index + 1}`}
                                    fill
                                    className='object-cover rounded-xs'
                                />
                            </div>
                        ))}
                    </div>

                    {/* Scroll buttons for horizontal layout (mobile) */}
                    {showScrollButtons.right && (
                        <button
                            onClick={scrollRight}
                            className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/70 rounded-full p-1 shadow-md hover:bg-white transition-all md:hidden'
                            aria-label='Scroll right'
                        >
                            <ChevronRight size={16} />
                        </button>
                    )}

                    {/* Scroll buttons for vertical layout (desktop) */}
                    {showScrollButtons.bottom && (
                        <button
                            onClick={scrollDown}
                            className='absolute bottom-0 left-1/2 -translate-x-1/2 z-10 bg-white/70 rounded-full p-1 shadow-md hover:bg-white transition-all hidden md:flex'
                            aria-label='Scroll down'
                        >
                            <ChevronDown size={16} />
                        </button>
                    )}
                </div>

                {/* Main Image */}
                <div
                    className='relative order-1 md:order-2 md:flex-1'
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <div className='relative mx-auto h-100 md:h-120 max-sm:max-w-100 md:aspect-square'>
                        <Image
                            src={helpers.getFileUrl(images[currentImageIndex].src)}
                            alt={images[currentImageIndex].alt}
                            fill
                            className='object-cover rounded-xl'
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
