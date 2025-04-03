import { fetchByKey } from '@/utils/fetch';
import { Metadata } from 'next';
import React from 'react';

export async function generateMetadata(): Promise<Metadata> {
    const data: any = await fetchByKey('managementTeamSeo');

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

const layout = ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>;
};

export default layout;
