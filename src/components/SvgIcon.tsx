// components/SvgIcon.tsx
import React from 'react';

interface SvgIconProps {
    src: string; // Raw SVG string
    className?: string; // Optional additional Tailwind classes
}

const SvgIcon: React.FC<SvgIconProps> = ({ src, className = '' }) => {
    return (
        <div className=''>
            <div
                className={` ${className}`}
                dangerouslySetInnerHTML={{ __html: src }}
            />
        </div>
    );
};

export default SvgIcon;
