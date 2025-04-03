'use client';

import BannerNavigation from '@/components/BannerNavigation';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface NavItem {
    name: string;
    path: string;
}

const ClientLayout = ({
    children,
    navItems,
}: {
    children: React.ReactNode;
    navItems: NavItem[];
}) => {
    const pathname = usePathname();
    const [title, setTitle] = useState('About');

    useEffect(() => {
        const check = navItems.find((item) => item.path === pathname);

        if (check) {
            setTitle(check.name);
        } else {
            setTitle('About');
        }
    }, [pathname, navItems]);

    console.log('title:', title);

    return (
        <>
            <div>
                <BannerNavigation title={title} items={navItems} />
            </div>
            <div className='custom-container mt-4'>{children}</div>
        </>
    );
};

export default ClientLayout;
