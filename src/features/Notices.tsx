"use client";

import Button from "@/components/Button";
import React from "react";

const Notices = ({ limit }: { limit: number }) => {
    const data = [
        {
            date: "2023-10-01",
            title: "Notice 1",
            description: "Description for notice 1",
            link: "https://example.com/notice1",
        },
    ];

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-16'>
            {Array(limit)
                .fill(data)
                .map((item, index) => (
                    <Items key={index} {...item[0]} />
                ))}
        </div>
    );
};
export default Notices;

const Items = ({ date, title, description, link }: any) => {
    return (
        <div className='relative border border-slate-200 rounded-lg'>
            <div className='p-4 flex justify-between'>
                <div className='flex-1'>
                    <div>{title}</div>
                    <div className='text-sm text-gray-500'>{description}</div>
                </div>
                <div className='text-primary'>{date}</div>
            </div>
            <Button
                onClick={() => window.open(link, "_blank")}
                className='absolute -bottom-6 right-4'
            >
                Learn More
            </Button>
        </div>
    );
};
