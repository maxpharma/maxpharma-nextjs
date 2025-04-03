import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Request Share Apply – Prabhu Steels And Hydro Investment',
    description:
        'Download the Share Investment Application form from Prabhu Steels and Hydro Investment. Fill in the details, upload the form along with your citizenship and bank voucher to request share investments.',
    keywords:
        'Share investment application Nepal, Prabhu Steels share request, Download share form, Share investment Prabhu Steels, Steel investment application, Bank voucher upload, Citizenship upload, Prabhu Steels share application form, Investment opportunities Nepal, Share request process',
};

const layout = ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>;
};

export default layout;
