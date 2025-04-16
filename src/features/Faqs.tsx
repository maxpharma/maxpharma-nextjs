"use client";

import FAQItem from "@/components/ui/FAQItem";
import React from "react";

const Faqs = () => {
    const data = [
        {
            question: "What is the return policy?",
            answer: "You can return any item within 30 days of purchase for a full refund. You can return any item within 30 days of purchase for a full refund.",
        },
    ];
    return (
        <div className='space-y-2'>
            <h1 className='text-center'>Have a Question?</h1>
            <p className='text-center'>
                We’ve got answers to the most common queries to help you
                out—quick, clear, and hassle-free.
            </p>

            <div className='w-full'>
                {Array(5)
                    .fill(data)
                    .map((item, index) => (
                        <FAQItem
                            key={index}
                            question={item[0].question}
                            answer={item[0].answer}
                            defaultOpen={index === 0 ? true : false}
                        />
                    ))}
            </div>
        </div>
    );
};

export default Faqs;
