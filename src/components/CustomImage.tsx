import Image from "next/image";
import React from "react";

type SizeType = "small" | "medium" | "large";
type OrientationType = "landscape" | "portrait" | "square";
type ObjectFitType = "cover" | "contain";
type VariantType = "local" | "live";

interface CustomImageProps {
    src: string;
    size?: SizeType;
    orientation?: OrientationType;
    fit?: ObjectFitType; // Defaults to 'cover'
    alt?: string;
    className?: string;
    imageClassName?: string; // Class name for the image itself
    variant?: VariantType; // New prop for local/live variant
}

// Tailwind size classes for landscape
const landscapeSizeMap: Record<SizeType, string> = {
    small: "w-36 h-24", // 192x128
    medium: "w-96 h-64", // 384x256
    large: "w-full h-96", // Full width x 384
};

// Tailwind size classes for portrait
const portraitSizeMap: Record<SizeType, string> = {
    small: "w-32 h-48", // 128x192
    medium: "w-64 h-96", // 256x384
    large: "w-96 h-[600px]", // 384x600
};

// Tailwind size classes for square
const squareSizeMap: Record<SizeType, string> = {
    small: "w-32 h-32", // 128x128
    medium: "w-64 h-64", // 256x256
    large: "w-96 h-96", // 384x384
};

const CustomImage: React.FC<CustomImageProps> = ({
    src,
    size = "medium",
    orientation = "landscape",
    fit = "contain",
    alt = src,
    className = "",
    imageClassName = "", // Default to empty string
    variant = "local", // Default to local
}) => {
    // Select the appropriate size map based on orientation
    let sizeMap;
    switch (orientation) {
        case "portrait":
            sizeMap = portraitSizeMap;
            break;
        case "square":
            sizeMap = squareSizeMap;
            break;
        default: // landscape
            sizeMap = landscapeSizeMap;
    }

    const containerSize = sizeMap[size];
    const objectFitClass =
        fit === "contain" ? "object-contain" : "object-cover";

    // Construct the image source based on the variant
    const imageSrc =
        variant === "live"
            ? `${process.env.NEXT_PUBLIC_BUCKET_URL}/${src}`
            : src;

    return (
        <>
            {!!src && (
                <div className={`relative ${className || containerSize} `}>
                    <Image
                        src={imageSrc}
                        alt={alt}
                        fill
                        className={`${objectFitClass} rounded-lg ${imageClassName}`}
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        priority
                    />
                </div>
            )}
        </>
    );
};

export default CustomImage;
