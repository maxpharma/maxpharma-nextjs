import { fetchByKey } from '@/utils/fetch';
import { Metadata } from 'next';
import React from 'react';

export async function generateMetadata(): Promise<Metadata> {
    const data: any = await fetchByKey('portfolioSeo');

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
        <div>
            <div className='custom-container mt-4'>{children}</div>
        </div>
    );
};

export default Layout;
