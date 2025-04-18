"use client";

import React, { useState } from "react";
import HomeFAQs from "./HomeFAQs";
import ProductFAQs from "./ProductFAQs";
import ContactFAQs from "./ContactFAQs";

const faqTypes = {
    home: {
        title: "Home FAQs",
        group: "homeFAQs",
    },
    product: {
        title: "Product FAQs",
        group: "productFAQs",
    },
    contact: {
        title: "Contact FAQs",
        group: "contactFAQs",
    },
};

type FaqTypeKey = keyof typeof faqTypes;

const FAQsPage = () => {
    const [selectedType, setSelectedType] = useState<FaqTypeKey>("home");

    return (
        <div className='space-y-4'>
            <h1>Add FAQs</h1>

            <div className='flex gap-4 items-center'>
                {Object.entries(faqTypes).map(([key, value]) => (
                    <button
                        key={key}
                        className={`${
                            selectedType === key
                                ? "active-button"
                                : "inactive-button"
                        }`}
                        onClick={() => setSelectedType(key as FaqTypeKey)}
                    >
                        {value.title}
                    </button>
                ))}
            </div>

            <div>
                {selectedType === "home" && <HomeFAQs type={faqTypes.home} />}
                {selectedType === "product" && (
                    <ProductFAQs type={faqTypes.product} />
                )}
                {selectedType === "contact" && (
                    <ContactFAQs type={faqTypes.contact} />
                )}
            </div>
        </div>
    );
};

export default FAQsPage;
