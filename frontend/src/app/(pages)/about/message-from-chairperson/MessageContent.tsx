"use client";

import AboutUs from "@/api/aboutUs";
import { bucketUrl } from "@/features/data";
import Image from "next/image";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const MessageContent = () => {
    const { items: messageData } = useSelector(
        (state: any) => state.aboutUsMessageFromChairperson || []
    );

    const fetchData = async () => {
        await AboutUs.get(
            "aboutUsMessageFromChairperson",
            "Message From Chairperson"
        );
    };

    useEffect(() => {
        fetchData();
    }, []);

    const data = messageData[0];

    return (
        <div className='flex flex-col items-center gap-4 md:gap-20 mt-16'>
            <div className='flex flex-col gap-4 items-center'>
                <Image
                    src={`${bucketUrl}/${data?.files?.[0]}`}
                    alt='Banner Image'
                    width={400}
                    height={400}
                    className='rounded-full size-48'
                    priority={true}
                />
                <span className='font-bold text-xl'>
                    {data?.infos?.name || "O.P Sah"}
                </span>
                <span className=''>
                    {data?.infos?.role || "Chairperson, Max Pharma Pvt. Ltd"}
                </span>
            </div>
            <div className='space-y-2'>
                <h1 className='mb-6'>
                    {data?.title ||
                        "Message from the Chairperson of Max Pharma Pvt. Ltd"}
                </h1>
                <div
                    dangerouslySetInnerHTML={{
                        __html: data?.description || "",
                    }}
                    className='space-y-4'
                />
                <div className='flex flex-col gap-2  mt-8'>
                    <span className='text-primary'>Warn Regards,</span>
                    <span className='font-bold'>O.P Sah</span>
                    <span>Chairperson</span>
                    <span>Max Pharma Pvt. Ltd</span>
                </div>
            </div>
        </div>
    );
};

export default MessageContent;
