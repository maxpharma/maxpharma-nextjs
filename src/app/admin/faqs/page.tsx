"use client";

import React, { useState } from "react";
import HomeFAQs from "./HomeFAQs";
import ProductFAQs from "./ProductFAQs";
import ContactFAQs from "./ContactFAQs";

const FAQsPage = () => {
    const [type, setType] = useState("Home");

    return (
        <div className='space-y-4'>
            <h1>Add FAQs</h1>

            <div className='flex gap-4 items-center'>
                <button
                    className={`${
                        type === "Home" ? "active-button" : "inactive-button"
                    }`}
                    onClick={() => setType("Home")}
                >
                    Home
                </button>
                <button
                    className={`${
                        type === "Product" ? "active-button" : "inactive-button"
                    }`}
                    onClick={() => setType("Product")}
                >
                    Product
                </button>
                <button
                    className={`${
                        type === "Contact" ? "active-button" : "inactive-button"
                    }`}
                    onClick={() => setType("Contact")}
                >
                    Contact
                </button>
            </div>

            <div>
                {type === "Home" && <HomeFAQs type={type} />}
                {type === "Product" && <ProductFAQs type={type} />}
                {type === "Contact" && <ContactFAQs type={type} />}
            </div>
        </div>
    );
};

export default FAQsPage;
