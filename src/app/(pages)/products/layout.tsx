"use client";

import BannerNavigation from "@/components/BannerNavigation";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProductLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    console.log(pathname === "/products");

    const aboutNavItems = [
        { name: "Imported Products", path: "/products" },

        {
            name: "Manufactured Products",
            path: "/products/manufactured-products",
        },
    ];

    const [title, setTitle] = useState("Products");

    useEffect(() => {
        const check = aboutNavItems.find((item) => item.path === pathname);

        if (check) {
            setTitle(check.name);
        } else {
            setTitle("About");
        }
    }, [pathname]);

    console.log("title:", title);
    return (
        <div>
            <div>
                {(pathname === "/products" ||
                    pathname === "/products/manufactured-products") && (
                    <BannerNavigation title={title} items={aboutNavItems} />
                )}
            </div>
            <div className='custom-container mt-4'>{children}</div>
        </div>
    );
};

export default ProductLayout;
