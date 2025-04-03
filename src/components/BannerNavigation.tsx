'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavigationItem = {
    name: string;
    path: string;
};

type BannerNavigationProps = {
    title: string;
    items: NavigationItem[];
    className?: string;
};

const BannerNavigation = ({
    title,
    items,
    className = '',
}: BannerNavigationProps) => {
    const pathname = usePathname();

    return (
        <div
            className={`mx-auto w-[98vw] bg-blue-50 rounded-xl py-8 ${className}`}
        >
            <div className='px-4 flex flex-col items-center gap-8'>
                <h1>{title}</h1>

                <div className='flex flex-wrap justify-center gap-1 md:gap-2'>
                    {items.map((item) => {
                        const isExactMatchOnly =
                            item.path.split('/').length === 2;

                        const isActive = isExactMatchOnly
                            ? pathname === item.path
                            : pathname === item.path ||
                              pathname?.startsWith(`${item.path}/`);

                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition duration-200
                  ${
                      isActive
                          ? 'bg-primary text-white'
                          : 'bg-white text-primary hover:bg-blue-100'
                  }
                `}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BannerNavigation;
