import React from 'react';

import { Metadata } from 'next';
import { fetchByKey } from '@/utils/fetch';

export async function generateMetadata(): Promise<Metadata> {
    const data: any = await fetchByKey('noticeBoardSeo');

    const parsedData = JSON.parse(data?.value || '{}');

    return {
        title: {
            default: parsedData?.title || 'checks',
            template: '%s | Prabhu Steels',
        },
        description: parsedData?.description || 'Default description',
        keywords: parsedData?.keywords || 'Default keywords',
        icons: {
            icon: '/logo.ico',
            apple: '/logo.ico',
            shortcut: '/logo.ico',
        },
    };
}

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className='custom-container mt-4'>{children}</div>
        </>
    );
};

export default Layout;
