"use client";

import React, { useState } from "react";
import { Formik, Form } from "formik";
import Input from "@/components/fields/Input";
import TextArea from "@/components/fields/TextArea";
import Upload from "@/components/fields/Upload";
import Button from "@/components/Button";
import Overlay from "@/components/Overlay";

const ServicePage = () => {
    // Predefined service categories
    const categories = [
        "Production Department",
        "Quality Assurance",
        "Quality Control",
        "Research & Development",
        "Store & Logistics",
    ];

    const [selectedCategory, setSelectedCategory] = useState(
        "Production Department"
    );
    const [initialValues, setInitialValues] = useState({
        title: "",
        description: "",
        bannerImage1: "",
        bannerImage2: "",
    });
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
    };

    const submitHandler = (values: any, { resetForm }: any) => {
        console.log("Submitting data for category:", selectedCategory);
        console.log(values);
    };

    return (
        <div className='space-y-6'>
            <h1>Add Services</h1>

            <div className='flex justify-between items-center'>
                <div className='flex flex-wrap gap-2 items-center'>
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`px-4 py-2 rounded-md ${
                                selectedCategory === category
                                    ? "active-button"
                                    : "inactive-button"
                            }`}
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <button
                    className='py-1 px-3 text-sm rounded-full border border-primary text-primary flex items-center gap-1'
                    onClick={() => setIsOverlayOpen(true)}
                >
                    Add Category
                    <span className='ml-1 text-xl'>+</span>
                </button>
            </div>

            <Formik
                initialValues={initialValues}
                onSubmit={submitHandler}
                enableReinitialize
            >
                <Form className='space-y-4'>
                    <div>
                        <label className='block mb-2 font-medium '>
                            {selectedCategory} Title
                        </label>
                        <Input
                            name='title'
                            placeholder='Title'
                            label=''
                            type='text'
                        />
                    </div>

                    <div>
                        <label className='block mb-2 font-medium'>
                            Description
                        </label>
                        <TextArea
                            name='description'
                            placeholder='Type description'
                            label=''
                            rows={6}
                        />
                    </div>

                    <div>
                        <label className='block mb-2 font-medium'>
                            Banner Images
                        </label>
                        <div className='flex space-x-4'>
                            <Upload
                                name='bannerImage1'
                                label=''
                                placeholder='Upload Image'
                                className='flex-1'
                                size={200}
                            />
                            <Upload
                                name='bannerImage2'
                                label=''
                                placeholder='Upload Image'
                                className='flex-1'
                                size={200}
                            />
                        </div>
                    </div>

                    <div className='flex justify-end'>
                        <Button variant='submit'>Save</Button>
                    </div>
                </Form>
            </Formik>

            {isOverlayOpen && (
                <Overlay
                    isOpen={isOverlayOpen}
                    onClose={() => setIsOverlayOpen(false)}
                >
                    <div className='space-y-4'>
                        <h1>Add Service Category</h1>
                        <Formik
                            initialValues={{ category: "" }}
                            onSubmit={(values) => {
                                console.log("New category:", values.category);
                                // Logic to add the new category
                                setIsOverlayOpen(false);
                            }}
                        >
                            <Form>
                                <Input
                                    name='category'
                                    label='Add new Category'
                                    placeholder='Category Name'
                                    type='text'
                                />
                                <div className='flex gap-4 mt-4'>
                                    <Button variant='submit'>
                                        Add Category
                                    </Button>
                                    <button
                                        type='button'
                                        onClick={() => setIsOverlayOpen(false)}
                                        className='px-4 py-2 border rounded-md'
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

export default ServicePage;
