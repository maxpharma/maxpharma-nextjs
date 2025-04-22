import { ToastContainer } from "react-toastify";
import ClientLayout from "./client-layout";
import "./globals.css";
import Providers from "./providers";
import { getSeoMetadata } from "@/utils/seo";

export async function generateMetadata() {
    return await getSeoMetadata("homeSeo");
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en'>
            <body className='font-sansation overflow-x-hidden bg-white'>
                <ToastContainer position='top-right' />
                <Providers>
                    <ClientLayout>{children}</ClientLayout>
                </Providers>
            </body>
        </html>
    );
}
