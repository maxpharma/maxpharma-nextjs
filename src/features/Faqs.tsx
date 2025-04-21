"use client";

import GeneralSettings from "@/api/generalSettings";
import FAQItem from "@/components/ui/FAQItem";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

interface FaqsProps {
    type: "homeFAQs" | "contactFAQs" | "productFAQs";
}

const Faqs = ({ type = "homeFAQs" }: FaqsProps) => {
    const router = useRouter();
    const data = [
        {
            question: "What is the return policy?",
            answer: "You can return any item within 30 days of purchase for a full refund. You can return any item within 30 days of purchase for a full refund.",
        },
    ];

    const { data: faqsData } = useSelector((state: any) => state[type]);

    const fetchData = async () => {
        await GeneralSettings.getByGroup(type, type);
    };

    useEffect(() => {
        fetchData();
    }, [router]);

    // Extract infos object from faqsData
    const infos = faqsData && faqsData.length > 0 ? faqsData[0].infos : {};

    return (
        <div className='space-y-2'>
            <h1 className='text-center'>Have a Question?</h1>
            <p className='text-center'>
                We’ve got answers to the most common queries to help you
                out—quick, clear, and hassle-free.
            </p>

            <div className='w-full'>
                {infos && Object.keys(infos).length > 0 ? (
                    Object.entries(infos).map(([question, answer], idx) => (
                        <FAQItem
                            key={question}
                            question={question}
                            answer={answer as string}
                            defaultOpen={idx === 0}
                        />
                    ))
                ) : (
                    <p className='text-center text-gray-400'>
                        No FAQs available.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Faqs;
