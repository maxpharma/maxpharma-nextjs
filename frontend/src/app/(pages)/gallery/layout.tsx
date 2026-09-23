import { getSeoMetadata } from "@/utils/seo";
import ClientLayout from "./client-layout";

export async function generateMetadata() {
    return await getSeoMetadata("gallerySeo");
}

export default function Layout({ children }: { children: React.ReactNode }) {
    const aboutNavItems = [
        { name: "Photos", path: "/gallery" },
        { name: "Videos", path: "/gallery/videos" },
    ];

    return <ClientLayout navItems={aboutNavItems}>{children}</ClientLayout>;
}
