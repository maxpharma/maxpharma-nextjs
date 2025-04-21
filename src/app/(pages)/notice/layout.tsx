"use client";

import BannerNavigation from "@/components/BannerNavigation";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const NoticeLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const aboutNavItems = [
        {
            name: "Important Notice",
            path: "/notice/important-notice",
        },
        {
            name: "Career Notice",
            path: "/notice/career-notice",
        },
    ];

    const [title, setTitle] = useState("About");

    useEffect(() => {
        const check = aboutNavItems.find((item) => item.path === pathname);

        if (check) {
            setTitle(check.name);
        } else {
            setTitle("About");
        }
    }, [pathname]);

    return (
        <>
            <div>
                <BannerNavigation title={title} items={aboutNavItems} />
            </div>
            <div className='custom-container mt-4'>{children}</div>
        </>
    );
};

export default NoticeLayout;
