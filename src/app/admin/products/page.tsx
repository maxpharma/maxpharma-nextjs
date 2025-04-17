"use client";

import React, { useState, useEffect } from "react";
import Overlay from "@/components/Overlay";
import { Form, Formik } from "formik";
import Input from "@/components/fields/Input";
import Button from "@/components/Button";
import TextArea from "@/components/fields/TextArea";
import Upload from "@/components/fields/Upload";
import SpecificationTable from "@/components/fields/SpecificationTable";
import Products from "@/api/product";
import ProductsData from "./ProductsData";

const ProductPage = () => {
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState("Imported Products");
    const [category, setCategory] = useState("All Products");
    const [isCategoryOverlayOpen, setIsCategoryOverlayOpen] = useState(false);
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [updateIdData, setUpdateIdData] = useState<any>(null);

    const categories = [
        "All Products",
        "Antibiotics & Antimicrobials",
        "Pain & Fever Management",
        "Cancer & Bone Health",
        "Hormonal Medications",
    ];

    const [initialValues, setInitialValues] = useState({
        productName: "",
        productOverview: "",
        images: [],
        specifications: {},
    });

    useEffect(() => {
        if (updateIdData?.id) {
            setInitialValues({
                productName: updateIdData.productName,
                productOverview: updateIdData.productOverview,
                images: updateIdData.images || [],
                specifications: updateIdData.specifications || {},
            });
            setType(updateIdData.type);
            setIsProductFormOpen(true);
        } else {
            setInitialValues({
                productName: "",
                productOverview: "",
                images: [],
                specifications: {},
            });
        }
    }, [updateIdData]);

    const handleCreateProduct = () => {
        setUpdateIdData(null);
        setInitialValues({
            productName: "",
            productOverview: "",
            images: [],
            specifications: {},
        });
        setIsProductFormOpen(true);
    };

    const closeProductForm = () => {
        setIsProductFormOpen(false);
        setUpdateIdData(null);
    };

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);
        const payload = {
            type: type,
            categoryId: 2,
            name: values.productName,
            description: values.productOverview,
            additionalInfo: values.specifications,
            files: values.images.map((file: any) => ({
                extension: file?.extension,
                base64: file?.base64,
            })),
        };

        let success = false;

        try {
            if (updateIdData?.id) {
                await Products.update(updateIdData.id, payload);
                success = true;
            } else {
                try {
                    await Products.create(payload);
                    success = true;
                } catch (createError) {
                    // If this is the specific error about reading 'data' property
                    // but the product was actually created, still mark as success
                    if (
                        createError instanceof Error &&
                        createError.message.includes(
                            "Cannot read properties of undefined (reading 'data')"
                        )
                    ) {
                        console.log(
                            "Product likely created despite response parsing error"
                        );
                        success = true;
                    } else {
                        throw createError;
                    }
                }
            }
        } catch (error) {
            console.error("Error with product operation:", error);
        } finally {
            setLoading(false);

            // If operation was successful, reset form and close overlay
            if (success) {
                resetForm();
                setUpdateIdData(null);
                closeProductForm();

                // Try to refresh data, but don't block on it
                Products.get().catch((err) => {
                    console.error("Error refreshing products data:", err);
                });
            }
        }
    };

    return (
        <div className='space-y-4'>
            <div className='flex justify-between items-center'>
                <h1>Products</h1>
                <Button onClick={handleCreateProduct} variant='submit'>
                    Create Product
                </Button>
            </div>

            {/* Product Type Tabs */}
            <div className='flex gap-4 items-center'>
                <button
                    className={`py-2 px-4 rounded ${
                        type === "Imported Products"
                            ? "active-button"
                            : "inactive-button"
                    }`}
                    onClick={() => setType("Imported Products")}
                >
                    Imported Products
                </button>
                <button
                    className={`py-2 px-4 rounded ${
                        type === "Manufactured Products"
                            ? "active-button"
                            : "inactive-button"
                    }`}
                    onClick={() => setType("Manufactured Products")}
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
                <button
                    className='py-1 px-3 text-sm rounded-full border border-primary text-primary flex items-center gap-1'
                    onClick={() => setIsCategoryOverlayOpen(true)}
                >
                    <span>Add Category</span>
                    <span className='text-xl'>+</span>
                </button>
            </div>

            {/* Products Data Table */}
            <div className='mt-8'>
                <ProductsData setUpdateIdData={setUpdateIdData} />
            </div>

            {/* Product Form Overlay */}
            {isProductFormOpen && (
                <Overlay isOpen={isProductFormOpen} onClose={closeProductForm}>
                    <div className='space-y-4'>
                        <h2 className='text-xl font-semibold'>
                            {updateIdData?.id
                                ? "Update Product"
                                : "Create Product"}
                        </h2>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={submitHandler}
                            enableReinitialize
                        >
                            {({ values }) => (
                                <Form>
                                    {/* Product Name */}
                                    <div className='mb-4'>
                                        <Input
                                            name='productName'
                                            label='Product Name'
                                            placeholder='Enter product name'
                                            type='text'
                                        />
                                    </div>

                                    {/* Product Overview */}
                                    <div className='mb-4'>
                                        <TextArea
                                            name='productOverview'
                                            label='Product Overview'
                                            placeholder='Write product details...'
                                        />
                                    </div>

                                    {/* Image Upload */}
                                    <div className='mb-4'>
                                        <div className='flex justify-between items-center mb-2'>
                                            <label className='font-medium'>
                                                Image
                                            </label>
                                        </div>
                                        <Upload
                                            name='images'
                                            label=''
                                            placeholder='Add Multiple Images'
                                            variant='multiple'
                                        />
                                    </div>

                                    {/* Specifications */}
                                    <div className='mb-4'>
                                        <SpecificationTable
                                            name='specifications'
                                            label='Product Specifications'
                                            keyPlaceholder='Enter specification name'
                                            valuePlaceholder='Enter value'
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className='flex justify-end gap-3'>
                                        <Button
                                            type='button'
                                            onClick={closeProductForm}
                                            variant='submit'
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            loading={loading}
                                            variant='submit'
                                        >
                                            {updateIdData?.id
                                                ? "Update"
                                                : "Create"}
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </Overlay>
            )}

            {/* Add Category Overlay */}
            {isCategoryOverlayOpen && (
                <Overlay
                    isOpen={isCategoryOverlayOpen}
                    onClose={() => setIsCategoryOverlayOpen(false)}
                >
                    <div className='space-y-4'>
                        <h1>Add Category</h1>
                        <Formik
                            initialValues={{ category: "" }}
                            onSubmit={() => {}}
                        >
                            <Form>
                                <Input
                                    name='category'
                                    label='Add new Category'
                                    placeholder='Category'
                                />
                                <div className='flex gap-4'>
                                    <Button variant='submit'>
                                        Add Category
                                    </Button>
                                    <button
                                        type='button'
                                        onClick={() =>
                                            setIsCategoryOverlayOpen(false)
                                        }
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
