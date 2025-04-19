"use client";

import BannerNavigation from "@/components/BannerNavigation";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const aboutNavItems = [
        {
            name: "Production Department",
            path: "/manufacturing/production-department",
        },
        {
            name: "Quality Assurance",
            path: "/manufacturing/quality-assurance",
        },
        {
            name: "Quality Control",
            path: "/manufacturing/quality-control",
        },
        {
            name: "Research & Development",
            path: "/manufacturing/research-development",
        },
        {
            name: "Store & Logistics",
            path: "/manufacturing/store-logistics",
        },
    ];

    const [title, setTitle] = useState("Manufacturing");

    useEffect(() => {
        const check = aboutNavItems.find((item) => item.path === pathname);

        if (check) {
            setTitle(check.name);
        } else {
            setTitle("Manufacturing");
        }
    }, [pathname]);

    console.log("title:", title);

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
