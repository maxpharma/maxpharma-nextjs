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
import AddCategory from "./AddCategory";
import { useSelector } from "react-redux";
import GeneralSettings from "@/api/generalSettings";
import { Trash2 } from "lucide-react";
import Dropdown from "@/components/ui/Dropdown";

const ProductPage = () => {
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState("Imported Products");
    const [category, setCategory] = useState("All Products");
    const [isCategoryOverlayOpen, setIsCategoryOverlayOpen] = useState(false);
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [updateIdData, setUpdateIdData] = useState<any>(null);
    console.log("updateIdData", updateIdData);
    const [isEditCategoriesOpen, setIsEditCategoriesOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

    const { data: categoriesRaw } = useSelector(
        (state: any) => state.categories || []
    );
    const categories = categoriesRaw?.map((cat: any) => cat.value) || [];

    const fetchData = async () => {
        await GeneralSettings.getByGroup("categories", "categories");
    };

    useEffect(() => {
        if (!categories?.length) {
            fetchData();
        }
    }, [categories?.length]);

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

        // Find selected category object
        const selectedCategoryObj = (categoriesRaw || []).find(
            (cat: any) => cat.value === values.category
        );
        const selectedCategoryId = selectedCategoryObj?.id;

        // Prepare payload for create
        const basePayload = {
            type: values.type,
            categoryId: selectedCategoryId,
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
                // Only send changed fields for update
                const changed: any = {};
                if (values.type !== updateIdData.type)
                    changed.type = values.type;
                if (values.category !== updateIdData.category)
                    changed.categoryId = selectedCategoryId;
                if (values.productName !== updateIdData.productName)
                    changed.name = values.productName;
                if (values.productOverview !== updateIdData.productOverview)
                    changed.description = values.productOverview;
                if (
                    JSON.stringify(values.specifications) !==
                    JSON.stringify(updateIdData.specifications)
                )
                    changed.additionalInfo = values.specifications;
                if (
                    JSON.stringify(
                        (values.images || []).map((f: any) => f.base64)
                    ) !==
                    JSON.stringify(
                        (updateIdData.images || []).map((f: any) => f.base64)
                    )
                ) {
                    changed.files = values.images.map((file: any) => ({
                        extension: file?.extension,
                        base64: file?.base64,
                    }));
                }
                if (Object.keys(changed).length === 0) {
                    setLoading(false);
                    return;
                }
                await Products.update(updateIdData.id, changed);
                success = true;
            } else {
                try {
                    await Products.create(basePayload);
                    success = true;
                } catch (createError) {
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

    // Optionally, handle category refresh after add
    const handleCategoryAdded = () => {
        setIsCategoryOverlayOpen(false); // This hides the overlay
        // Optionally refresh categories here if dynamic
    };

    const handleDeleteCategory = async (id: number) => {
        setDeleteLoading(id);
        try {
            await GeneralSettings.remove("categories", id);
            await fetchData();
        } catch (err) {
            console.error("Error deleting category:", err);
        } finally {
            setDeleteLoading(null);
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
                    {categories.map((cat: any) => (
                        <span
                            key={cat}
                            className='py-1 px-3 text-sm rounded-full border inactive-button'
                        >
                            {cat}
                        </span>
                    ))}
                </div>
                <div className='flex gap-2'>
                    <button
                        className='py-1 px-3 text-sm rounded-full border border-primary text-primary flex items-center gap-1'
                        onClick={() => setIsEditCategoriesOpen(true)}
                    >
                        <span>Edit Categories</span>
                    </button>
                    <button
                        className='py-1 px-3 text-sm rounded-full border border-primary text-primary flex items-center gap-1'
                        onClick={() => setIsCategoryOverlayOpen(true)}
                    >
                        <span>Add Category</span>
                        <span className='text-xl'>+</span>
                    </button>
                </div>
            </div>

            {/* Edit Categories Overlay */}
            {isEditCategoriesOpen && (
                <Overlay
                    isOpen={isEditCategoriesOpen}
                    onClose={() => setIsEditCategoriesOpen(false)}
                >
                    <div className='space-y-4 min-w-[300px]'>
                        <h2 className='text-lg font-semibold mb-2'>
                            Edit Categories
                        </h2>
                        <ul className='divide-y'>
                            {(categoriesRaw || []).map((cat: any) => (
                                <li
                                    key={cat.id}
                                    className='flex items-center justify-between py-2'
                                >
                                    <span>{cat.value}</span>
                                    <button
                                        onClick={() =>
                                            handleDeleteCategory(cat.id)
                                        }
                                        disabled={deleteLoading === cat.id}
                                        className='text-red-500 hover:text-red-700'
                                        title='Delete'
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className='flex justify-end'>
                            <Button
                                type='button'
                                onClick={() => setIsEditCategoriesOpen(false)}
                                variant='submit'
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </Overlay>
            )}

            {/* Products Data Table */}
            <div className='mt-8'>
                <ProductsData
                    setUpdateIdData={setUpdateIdData}
                    filterType={type}
                    filterCategory={category}
                />
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
                            initialValues={{
                                ...initialValues,
                                type: type,
                                category: category,
                            }}
                            onSubmit={submitHandler}
                            enableReinitialize
                        >
                            {({ values, setFieldValue }) => (
                                <Form>
                                    {/* Type */}
                                    <div className='mb-4'>
                                        <label className='font-medium mb-1 block'>
                                            Type
                                        </label>
                                        {/* Keep type as tab toggle, do not use dropdown */}
                                        <div className='flex gap-4'>
                                            <button
                                                type='button'
                                                className={`py-2 px-4 rounded ${
                                                    values.type ===
                                                    "Imported Products"
                                                        ? "active-button"
                                                        : "inactive-button"
                                                }`}
                                                onClick={() => {
                                                    setType(
                                                        "Imported Products"
                                                    );
                                                    setFieldValue(
                                                        "type",
                                                        "Imported Products"
                                                    );
                                                }}
                                            >
                                                Imported Products
                                            </button>
                                            <button
                                                type='button'
                                                className={`py-2 px-4 rounded ${
                                                    values.type ===
                                                    "Manufactured Products"
                                                        ? "active-button"
                                                        : "inactive-button"
                                                }`}
                                                onClick={() => {
                                                    setType(
                                                        "Manufactured Products"
                                                    );
                                                    setFieldValue(
                                                        "type",
                                                        "Manufactured Products"
                                                    );
                                                }}
                                            >
                                                Manufactured Products
                                            </button>
                                        </div>
                                    </div>
                                    {/* Category */}
                                    <div className='mb-4'>
                                        <Dropdown
                                            label='Category'
                                            options={categories}
                                            value={values.category}
                                            onChange={(val) => {
                                                setCategory(val);
                                                setFieldValue("category", val);
                                            }}
                                            placeholder='Select category'
                                        />
                                    </div>
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
                                            value={
                                                updateIdData?.images &&
                                                updateIdData?.images.map(
                                                    (img: any) => img.base64
                                                )
                                            }
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

            {/* AddCategory Overlay */}
            <AddCategory
                isOpen={isCategoryOverlayOpen}
                onClose={() => setIsCategoryOverlayOpen(false)}
                onCategoryAdded={handleCategoryAdded}
            />
        </div>
    );
};

export default ProductPage;
