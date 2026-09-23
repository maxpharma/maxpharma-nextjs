import React from 'react';
import Image from 'next/image';

interface SvgIconProps {
    pathname: string;
    alt?: string;
    className?: string;
    width?: number;
    height?: number;
}

const SvgIcon: React.FC<SvgIconProps> = ({
    pathname,
    alt = 'Icon',
    className = '',
    width = 16,
    height = 16,
}) => {
    return (
        <div className={`w-4 h-4 ${className}`}>
            <Image
                src={pathname}
                alt={alt}
                width={width}
                height={height}
                className='w-full h-full'
            />
        </div>
    );
};

export default SvgIcon;
