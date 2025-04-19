// gallery/layout.tsx (Server Component)

import { Metadata } from "next";
import ClientLayout from "./client-layout";
import { fetchByKey } from "@/utils/fetch";

// export async function generateMetadata(): Promise<Metadata> {
//     const data: any = await fetchByKey('gallerySeo');

//     const parsedData = JSON.parse(data?.value || '{}');

//     return {
//         title: {
//             default: parsedData?.title || 'checks',
//             template: '%s | Prabhu Steels',
//         },
//         description: parsedData?.description || 'Default description',
//         keywords: parsedData?.keywords || 'Default keywords',
//         icons: {
//             icon: '/logo.ico',
//             apple: '/logo.ico',
//             shortcut: '/logo.ico',
//         },
//     };
// }

export default function Layout({ children }: { children: React.ReactNode }) {
    const aboutNavItems = [
        { name: "Photos", path: "/gallery" },
        { name: "Videos", path: "/gallery/videos" },
    ];

    return <ClientLayout navItems={aboutNavItems}>{children}</ClientLayout>;
}
