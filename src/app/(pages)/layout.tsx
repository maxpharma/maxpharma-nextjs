import AdvertisementBanner from "@/features/AdvertisementBanner";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <div>{children}</div>
            <div className='custom-container mt-16'>
                <AdvertisementBanner />
            </div>
        </div>
    );
};

export default Layout;
