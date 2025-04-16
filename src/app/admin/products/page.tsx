"use client";

import React, { useState } from "react";
import Imported from "./Imported";
import Manufactured from "./Manufactured";
import Overlay from "@/components/Overlay";
import { Form, Formik } from "formik";
import Input from "@/components/fields/Input";
import Button from "@/components/Button";

const ProductPage = () => {
    const [type, setType] = useState("Imported");
    const [category, setCategory] = useState("All Products");
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    const categories = [
        "All Products",
        "Antibiotics & Antimicrobials",
        "Pain & Fever Management",
        "Cancer & Bone Health",
        "Hormonal Medications",
    ];

    return (
        <div className='space-y-4'>
            <h1>Add Product</h1>

            {/* Product Type Tabs */}
            <div className='flex gap-4 items-center'>
                <button
                    className={`py-2 px-4 rounded ${
                        type === "Imported"
                            ? "active-button"
                            : "inactive-button"
                    }`}
                    onClick={() => setType("Imported")}
                >
                    Imported Products
                </button>
                <button
                    className={`py-2 px-4 rounded ${
                        type === "Manufactured"
                            ? "active-button"
                            : "inactive-button"
                    }`}
                    onClick={() => setType("Manufactured")}
                >
                    Manufactured Products
                </button>
            </div>

            {/* Categories */}
            <div className='flex justify-between'>
                <div className='flex gap-2 items-center flex-wrap'>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`py-1 px-3 text-sm rounded-full border ${
                                category === cat
                                    ? "active-button"
                                    : "inactive-button"
                            }`}
                            onClick={() => setCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <button className='py-1 px-3 text-sm rounded-full border border-primary text-primary flex items-center gap-1'>
                    <span
                        onClick={() => {
                            setIsOverlayOpen(true);
                        }}
                    >
                        Add Category
                    </span>
                    <span className='text-xl'>+</span>
                </button>
            </div>

            {/* Render appropriate component */}
            <div>
                {type === "Imported" && <Imported category={category} />}
                {type === "Manufactured" && (
                    <Manufactured category={category} />
                )}
            </div>
            {isOverlayOpen && (
                <Overlay
                    isOpen={isOverlayOpen}
                    onClose={() => setIsOverlayOpen(false)}
                >
                    <div className='space-y-4'>
                        <h1>Add Category</h1>
                        <Formik
                            initialValues={{ category: "" }}
                            onSubmit={() => {}}
                        >
                            <Form>
                                <Input
                                    name='New category'
                                    label='Add new Category'
                                    placeholder='Category'
                                />
                                <div className='flex  gap-4'>
                                    <Button variant='submit'>
                                        Add Category
                                    </Button>
                                    <button
                                        type='button'
                                        onClick={() => setIsOverlayOpen(false)}
                                        className='cancel-button'
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </Overlay>
            )}
        </div>
    );
};

export default ProductPage;
