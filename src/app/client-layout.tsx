"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Popup from "@/api/popup";
import CustomImage from "@/components/CustomImage";
import Image from "next/image";
import { color } from "@/utils/theme";

interface ClientLayoutProps {
    children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
    useEffect(() => {
        function loadTheme() {
            // Static theme colors for now
            const primaryColor = "#7D8E23"; // Static primary color (hex)
            const secondaryColor = "#FFF2FD"; // Static secondary color (hex)

            // Set CSS variables
            document.documentElement.style.setProperty(
                "--color-primary",
                primaryColor
            );
            document.documentElement.style.setProperty(
                "--color-secondary",
                secondaryColor
            );
        }

        loadTheme();
    }, []);

    const fetchData = async () => {
        await Popup.getData("popup");
    };

    const { items: popupData } = useSelector((state: any) => state.popup || []);
    const [showPopup, setShowPopup] = useState(true); // Control popup visibility

    useEffect(() => {
        if (!popupData?.length) {
            fetchData();
        }
    }, [popupData?.length]);

    const activePopup = popupData.find((item: any) => item.status === true);
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith("/admin");

    // Ref to detect click outside
    const popupRef = useRef<HTMLDivElement>(null);

    // Close popup on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node)
            ) {
                setShowPopup(false);
            }
        };

        if (showPopup && activePopup) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPopup, activePopup]);

    return (
        <>
            {!isAdminRoute && <Navbar />}

            {pathname === "/" && activePopup?.image && showPopup && (
                <div className='fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50'>
                    <div ref={popupRef} className='relative'>
                        <Image
                            src={`${process.env.NEXT_PUBLIC_BUCKET_URL}/${activePopup.image}`}
                            alt='Popup'
                            width={500}
                            height={500}
                            className='max-w-full max-h-full'
                        />
                    </div>
                </div>
            )}

            <main>{children}</main>

            {!isAdminRoute && <Footer />}
        </>
    );
};

export default ClientLayout;
