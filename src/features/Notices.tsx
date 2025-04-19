"use client";

import Button from "@/components/Button";
import Upload from "@/components/fields/Upload";
import Overlay from "@/components/Overlay";
import React, { useEffect, useState } from "react";
import ApplyNow from "./ApplyNow";
import { useSelector } from "react-redux";
import Notice from "@/api/notice";

// Define types for our data

// Define variants for the Items component
type ItemVariant = "notice" | "job";

const Notices = ({
    limit,
    variant = "notice",
}: {
    limit: number;
    variant?: ItemVariant;
}) => {
    const { items: noticesData } = useSelector((state: any) => state.notices);

    const fetchData = async () => {
        await Notice.get();
    };

    useEffect(() => {
        if (!noticesData.length) {
            fetchData();
        }
    }, [noticesData.length]);

    const importantNoticeData = noticesData.filter(
        (item: any) => item?.documentType === "Important Notice"
    );

    const careerNoticeData = noticesData.filter(
        (item: any) => item?.documentType === "Career Notice"
    );
    console.log("careerNoticeData", careerNoticeData);

    return (
        <div
            className={`${
                variant === "notice"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
                    : "max-w-4xl mx-auto flex flex-col gap-8"
            }`}
        >
            {(variant === "notice"
                ? importantNoticeData.slice(0, limit)
                : careerNoticeData.slice(0, limit)
            ).map((item: any, index: number) => (
                <Items key={index} {...item} variant={variant} />
            ))}
        </div>
    );
};

export default Notices;

const Items = ({ date, title, link, variant = "notice", id }: any) => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [jobId, setJobId] = useState<number | null>(null);
    console.log("jobId", jobId);

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
                                        setJobId(id);
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
                    <ApplyNow
                        id={jobId}
                        onSuccess={() => setIsOverlayOpen(false)}
                    />
                </Overlay>
            )}
        </>
    );
};
