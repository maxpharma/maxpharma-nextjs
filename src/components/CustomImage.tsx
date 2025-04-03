// components/CustomImage.tsx
import Image from 'next/image';
import React from 'react';

type SizeType = 'small' | 'medium' | 'large';
type OrientationType = 'landscape' | 'portrait';
type ObjectFitType = 'cover' | 'contain';

interface CustomImageProps {
    src: string;
    size: SizeType;
    orientation?: OrientationType;
    fit?: ObjectFitType; // Defaults to 'cover'
    alt?: string;
    className?: string;
}

// Tailwind size classes for landscape
const landscapeSizeMap: Record<SizeType, string> = {
    small: 'w-48 h-32', // 192x128
    medium: 'w-96 h-64', // 384x256
    large: 'w-full h-96', // Full width x 384
};

// Tailwind size classes for portrait
const portraitSizeMap: Record<SizeType, string> = {
    small: 'w-32 h-48', // 128x192
    medium: 'w-64 h-96', // 256x384
    large: 'w-96 h-[600px]', // 384x600
};

const CustomImage: React.FC<CustomImageProps> = ({
    src,
    size = 'medium',
    orientation = 'landscape',
    fit = 'contain',
    alt = src,
    className = '',
}) => {
    const sizeMap =
        orientation === 'landscape' ? landscapeSizeMap : portraitSizeMap;
    const containerSize = sizeMap[size];
    const objectFitClass =
        fit === 'contain' ? 'object-contain' : 'object-cover';

    return (
        <div className={`relative ${containerSize} ${className}`}>
            <Image
                src={src}
                alt={alt}
                fill
                className={`${objectFitClass} rounded-lg`}
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                priority
            />
        </div>
    );
};

export default CustomImage;
