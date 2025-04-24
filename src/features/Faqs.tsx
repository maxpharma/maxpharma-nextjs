"use client";

import GeneralSettings from "@/api/generalSettings";
import FAQItem from "@/components/ui/FAQItem";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

interface FaqsProps {
    type: "Home" | "Contact" | "Product";
}

const Faqs = ({ type = "Home" }: FaqsProps) => {
    const router = useRouter();

    const { data: faqsData } = useSelector((state: any) => state.faqs);

    const faqsArray = Array.isArray(faqsData) ? [...faqsData].reverse() : [];

    const filteredData =
        faqsArray.filter((item: any) => item?.value === type) || [];

    const infos =
        filteredData.length > 0
            ? filteredData.reduce((acc: Record<string, string>, item: any) => {
                  if (item?.infos?.question && item?.infos?.answer) {
                      acc[item.infos.question] = item.infos.answer;
                  }
                  return acc;
              }, {})
            : {};

    useEffect(() => {
        if (!faqsArray.length) {
            GeneralSettings.getByGroup("faqs", "faqs");
        }
    }, [faqsArray.length, type]);

    return (
        <div className='space-y-2 mx-auto md:max-w-7/10'>
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
