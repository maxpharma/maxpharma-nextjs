"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItemProps {
    question: string;
    answer: string;
    defaultOpen?: boolean; // New prop for default open state
}

const FAQItem = ({ question, answer, defaultOpen = false }: FAQItemProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen); // Initialize with defaultOpen

    return (
        <div className='border-b border-gray-200 py-4'>
            <div
                className='flex justify-between items-center cursor-pointer select-none'
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className=' font-medium text-gray-900'>{question}</h3>
                <div className='transition-transform duration-300 ease-in-out'>
                    {isOpen ? (
                        <Minus className='text-gray-600 hover:text-gray-900' />
                    ) : (
                        <Plus className='text-gray-600 hover:text-gray-900' />
                    )}
                </div>
            </div>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out 
                    ${
                        isOpen
                            ? "max-h-96 opacity-100 mt-4"
                            : "max-h-0 opacity-0 mt-0"
                    }`}
            >
                <p className='text-gray-600'>{answer}</p>
            </div>
        </div>
    );
};

export default FAQItem;
