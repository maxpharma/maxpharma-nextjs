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
import WebsiteData from "@/features/theme";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const theme = WebsiteData();

  useEffect(() => {
    function loadTheme() {
      // Static theme colors for now
      const primaryColor = theme.primaryColor;
      const lightPrimaryColor = theme.primaryLightColor;

      const secondaryColor = theme.secondaryColor;

      // Set CSS variables
      document.documentElement.style.setProperty(
        "--color-primary",
        primaryColor
      );
      document.documentElement.style.setProperty(
        "--color-secondary",
        secondaryColor
      );
      document.documentElement.style.setProperty(
        "--color-light-primary",
        lightPrimaryColor
      );
    }

    loadTheme();
  }, [theme.primaryColor, theme.secondaryColor]);

  const fetchData = async () => {
    await Popup.getData("popup");
  };

  const { items: popupData } = useSelector((state: any) => state.popup || []);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    if (!popupData?.length) {
      fetchData();
    }
  }, [popupData?.length]);

  console.log("popupData", popupData);

  const activePopup = popupData.find((item: any) => item.status === true);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  const popupRef = useRef<HTMLDivElement>(null);

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
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
          <div ref={popupRef} className="relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_BUCKET_URL}/${activePopup.image}`}
              alt="Popup"
              width={500}
              height={500}
              className="max-w-full max-h-full"
            />
          </div>
        </div>
      )}

      <main>{children}</main>

      {!isAdminRoute && !pathname.startsWith("/products/") && <Footer />}
    </>
  );
};

export default ClientLayout;
