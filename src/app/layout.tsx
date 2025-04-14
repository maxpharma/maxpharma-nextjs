import { fetchByKey } from "@/utils/fetch";
import { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import ClientLayout from "./client-layout";
import "./globals.css";
import Providers from "./providers";

export async function generateMetadata(): Promise<Metadata> {
    const data: any = await fetchByKey("homeSeo");

    const parsedData = JSON.parse(data?.value || "{}");

    return {
        title: {
            default: parsedData?.title || "Max Pharma",
            template: `%s - ${parsedData?.title}`,
        },
        description: parsedData?.description,
        keywords: parsedData?.keywords,
        icons: {
            icon: "/logo.ico",
            apple: "/logo.ico",
            shortcut: "/logo.ico",
        },
    };
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en'>
            <body className='font-sansation'>
                <ToastContainer position='top-right' />
                <Providers>
                    <ClientLayout>{children}</ClientLayout>
                </Providers>
            </body>
        </html>
    );
}
