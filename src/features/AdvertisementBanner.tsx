import Button from "@/components/Button";
import CustomImage from "@/components/CustomImage";
import React from "react";

const AdvertisementBanner = () => {
    return (
        <section className='bg-secondary rounded-2xl px-4 py-8'>
            <div className='flex justify-between items-center'>
                <div className='flex flex-col gap-4 max-w-2xl'>
                    <div className='text-lg md:text-2xl lg:text-4xl font-semibold'>
                        Heading towards a Promising Future in Healthcare
                    </div>
                    <p>
                        Explore high-quality medicines and healthcare solutions
                        designed to keep you and your loved ones safe.
                    </p>
                    <Button>Learn More</Button>
                </div>
                <div>
                    <CustomImage src='/images/ad-banner.png' />
                </div>
            </div>
        </section>
    );
};

export default AdvertisementBanner;
