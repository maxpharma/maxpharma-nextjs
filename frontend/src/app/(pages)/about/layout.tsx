"use client";

import BannerNavigation from "@/components/BannerNavigation";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const aboutNavItems = [
    { name: "Overview", path: "/about" },
    {
        name: "Message from Chairperson",
        path: "/about/message-from-chairperson",
    },
    {
        name: "Organization Hierarchy",
        path: "/about/organization-hierarchy",
    },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

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

export default Layout;
