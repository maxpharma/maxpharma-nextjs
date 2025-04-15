import GalleryCard from "@/features/GalleryCard";
import React from "react";

const page = () => {
    return (
        <section>
            <div className='flex flex-col lg:flex-row gap-4 lg:gap-12 lg:items-center'>
                <div className='w-full lg:w-6/10 flex flex-col gap-2 md:gap-6'>
                    <h1>Store & Logistics</h1>
                    <p>
                        At Max Pharma Pvt. Ltd., we prioritize the optimal
                        storage of all our products, ensuring that every item is
                        kept in state-of-the-art facilities equipped with
                        sophisticated monitoring systems and stringent
                        temperature controls. This commitment to quality spans
                        every phase of our distribution process, where rigorous
                        quality control procedures are implemented to safeguard
                        the effectiveness and safety of our products.
                    </p>
                    <p>
                        We utilize advanced inventory management systems to
                        monitor stock levels, expiration dates, and batch
                        numbers, ensuring precise control over stock rotation
                        and minimizing waste. Our strategic partnerships with
                        reliable logistics providers allow us to maintain a
                        robust global distribution network, enabling us to
                        deliver pharmaceuticals securely and efficiently to
                        healthcare providers and patients worldwide.
                    </p>
                    <p>
                        Our warehouses and logistics operations adhere to the
                        highest standards, offering peace of mind to our
                        customers. At Max Pharma, we are committed to continual
                        improvement and strict compliance with regulatory
                        standards, contributing to a sustainable and healthier
                        future for people and communities.
                    </p>
                </div>
                <div className='lg:w-4/10'>
                    <GalleryCard />
                </div>
            </div>
        </section>
    );
};

export default page;
