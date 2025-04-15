"use client";

import Button from "@/components/Button";
import Upload from "@/components/fields/Upload";
import Overlay from "@/components/Overlay";
import React, { useState } from "react";
import ApplyNow from "./ApplyNow";

// Define types for our data
interface NoticeItem {
    date: string;
    title: string;
    description: string;
    link: string;
}

// Define variants for the Items component
type ItemVariant = "notice" | "job";

interface ItemsProps {
    date: string;
    title: string;
    link: string;
    description?: string;
    variant?: ItemVariant;
}

const Notices = ({
    limit,
    variant = "notice",
}: {
    limit: number;
    variant?: ItemVariant;
}) => {
    const data: NoticeItem[] = [
        {
            date: "2023-10-01",
            title: "Notice 1",
            description: "Description for notice 1",
            link: "https://example.com/notice1",
        },
    ];

    return (
        <div
            className={`${
                variant === "notice"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
                    : "max-w-4xl mx-auto flex flex-col gap-8"
            }`}
        >
            {Array(limit)
                .fill(data)
                .map((item, index) => (
                    <Items key={index} {...item[0]} variant={variant} />
                ))}
        </div>
    );
};

export default Notices;

const Items = ({
    date,
    title,
    link,
    description,
    variant = "notice",
}: ItemsProps) => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    return (
        <>
            {variant === "notice" ? (
                <div className='relative border border-slate-200 rounded-xl'>
                    <div className='px-4 pt-4 pb-6 flex justify-between'>
                        <div>{title}</div>
                        <div className='text-primary text-xs'>{date}</div>
                    </div>

                    <Button className='absolute -bottom-6 right-4'>
                        Learn More
                    </Button>
                </div>
            ) : variant === "job" ? (
                <div className='relative shadow-md rounded-lg p-2'>
                    <div className='p-4 flex justify-between'>
                        <div className='flex-1'>
                            <div>{title}</div>
                            <div className='text-primary text-xs'>{date}</div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <div className='flex gap-4 justify-center'>
                                <button className='secondary-button'>
                                    View Job
                                </button>
                                <button
                                    className='button'
                                    onClick={() => {
                                        setIsOverlayOpen(true);
                                    }}
                                >
                                    Apply now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {isOverlayOpen && (
                <Overlay
                    isOpen={isOverlayOpen}
                    onClose={() => setIsOverlayOpen(false)}
                >
                    <ApplyNow />
                </Overlay>
            )}
        </>
    );
};
