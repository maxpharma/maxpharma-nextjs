"use client";

import Notice from "@/api/notice";
import Button from "@/components/Button";
import Overlay from "@/components/Overlay";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ApplyNow from "./ApplyNow";
import { bucketUrl } from "./data";
import EmptyState from "@/components/EmptyState";

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

    return (
        <>
            {noticesData.length === 0 && (
                <EmptyState
                    title={
                        variant === "notice"
                            ? "No Notices Found"
                            : "No Career Notices Found"
                    }
                    message='Oops! There are no notices available at the moment.'
                />
            )}
            <div
                className={`${
                    variant === "notice"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
                        : "max-w-4xl mx-auto flex flex-col gap-8"
                }`}
            >
                {noticesData.length > 0 && (
                    <h1 className='text-2xl font-semibold'>
                        {variant === "notice" ? "Notices" : "Career Notices"}
                    </h1>
                )}

                {(variant === "notice"
                    ? importantNoticeData.slice(0, limit)
                    : careerNoticeData.slice(0, limit)
                ).map((item: any, index: number) => (
                    <Items key={index} {...item} variant={variant} />
                ))}
            </div>
        </>
    );
};

export default Notices;

const Items = ({ date, title, file, variant = "notice", id }: any) => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [jobId, setJobId] = useState<number | null>(null);

    return (
        <>
            {variant === "notice" ? (
                <div className='relative border border-slate-200 rounded-xl'>
                    <div className='px-4 pt-4 pb-6 flex justify-between'>
                        <div>{title}</div>
                        <div className='text-primary text-xs'>
                            {date.split("T")[0]}
                        </div>
                    </div>
                    <a
                        href={`${bucketUrl}/${file}`}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Button className='absolute -bottom-6 right-4'>
                            Learn More
                        </Button>
                    </a>
                </div>
            ) : variant === "job" ? (
                <div className='relative shadow-md rounded-lg p-2'>
                    <div className='p-4 flex justify-between'>
                        <div className='flex-1'>
                            <div>{title}</div>
                            <div className='text-primary text-xs'>
                                {date.split("T")[0]}
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <div className='flex gap-4 justify-center'>
                                <a
                                    href={`${bucketUrl}/${file}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <button className='secondary-button'>
                                        View Job
                                    </button>
                                </a>
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
