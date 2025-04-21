"use client";

import Services from "@/api/services";
import { bucketUrl } from "@/features/data";
import GalleryCard from "@/features/GalleryCard";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const ServiceContents = ({ id }: { id: number }) => {
    const { items: servicesData } = useSelector(
        (state: any) => state.services || []
    );
    const fetchServicesData = async () => {
        await Services.get(id);
    };

    useEffect(() => {
        if (id) {
            fetchServicesData();
        }
    }, [id]);

    return (
        <section>
            <div className='flex flex-col lg:flex-row gap-4 lg:gap-12 lg:items-center'>
                <div className='w-full lg:w-6/10 flex flex-col gap-2 md:gap-6'>
                    <h1>{servicesData[0]?.title}</h1>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: servicesData[0]?.description || "",
                        }}
                        className='space-y-4'
                    />
                </div>
                <div className='lg:w-4/10'>
                    <GalleryCard
                        images={
                            servicesData[0]?.files?.map(
                                (image: any) => `${bucketUrl}/${image}`
                            ) || []
                        }
                    />
                </div>
            </div>
        </section>
    );
};

export default ServiceContents;
