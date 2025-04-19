"use client";

import React, { useState } from "react";
import ShareRequest from "./InquiryTableData";
import InquiryTableData from "./InquiryTableData";
import ProductInquiryTableData from "./ProductInquiryTableData";

const InquiryRequestPage = () => {
    const [type, setType] = useState("career-apply");

    return (
        <div className='space-y-4'>
            <h1>Inquiry Requests</h1>
            <div className='flex items-center gap-2'>
                <button
                    onClick={() => setType("career-apply")}
                    className={
                        type === "career-apply"
                            ? "active-button"
                            : "inactive-button"
                    }
                >
                    Career Apply
                </button>
                <button
                    onClick={() => setType("product-inquiry")}
                    className={
                        type === "product-inquiry"
                            ? "active-button"
                            : "inactive-button"
                    }
                >
                    Product Inquiry
                </button>
            </div>
            <div>
                {type === "career-apply" ? (
                    <InquiryTableData />
                ) : (
                    <ProductInquiryTableData />
                )}
            </div>
        </div>
    );
};

export default InquiryRequestPage;
