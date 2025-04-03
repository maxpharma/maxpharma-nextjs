'use client';

import BannerNavigation from '@/components/BannerNavigation';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    console.log('pathname:', pathname);

    const aboutNavItems = [{ name: 'Siddhartha Cable Car', path: '/projects' }];

    const [title, setTitle] = useState('About');

    useEffect(() => {
        const check = aboutNavItems.find((item) => item.path === pathname);

        if (check) {
            setTitle(check.name);
        } else {
            setTitle('About');
        }
    }, [pathname]);

    console.log('title:', title);

    return (
        <>
            <div>
                <BannerNavigation title={title} items={aboutNavItems} />
            </div>
            <div className='custom-container mt-4'>{children}</div>
        </>
    );
};

export default Layout;
