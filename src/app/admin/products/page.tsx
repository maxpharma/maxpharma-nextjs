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
import MyEditor from "@/components/fields/MyEditor";
import MultipleUpload from "@/components/fields/MultipleUpload";

const ProductPage = () => {
    const [loading, setLoading] = useState(false);
    const [isCategoryOverlayOpen, setIsCategoryOverlayOpen] = useState(false);
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [updateIdData, setUpdateIdData] = useState<any>(null);
    console.log("updateIdData", updateIdData);
    const [isEditCategoriesOpen, setIsEditCategoriesOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

    // Always call useSelector unconditionally
    const categoriesData = useSelector((state: any) => state.categories?.data);
    const categoriesRaw = Array.isArray(categoriesData) ? categoriesData : [];
    const categories = categoriesRaw.map((cat: any) => cat.value);

    const fetchData = async () => {
        await GeneralSettings.getByGroup("categories", "categories");
    };

    useEffect(() => {
        if (!categories?.length) {
            fetchData();
        }
    }, [categories?.length]);

    // Add category to initialValues for the form
    type ProductFormValues = {
        productName: string;
        productOverview: string;
        images: any[];
        specifications: Record<string, any>;
        type: string;
        category: string;
    };

    const [initialValues, setInitialValues] = useState<ProductFormValues>({
        productName: "",
        productOverview: "",
        images: [],
        specifications: {},
        type: "Imported Products",
        category: "", // <-- form's category value
    });

    console.log(initialValues.images, "initialValues images");

    useEffect(() => {
        // Helper to normalize images to string paths
        const normalizeImages = (images: any[]) =>
            (images || []).map((img: any) => {
                // If already a string path
                if (typeof img === "string" && img.startsWith("uploads/"))
                    return img;
                // If object with url property
                if (
                    img?.url &&
                    typeof img.url === "string" &&
                    img.url.startsWith("uploads/")
                )
                    return img.url;
                // If object with base64 as URL
                if (
                    img?.base64 &&
                    typeof img.base64 === "string" &&
                    (img.base64.startsWith("http") ||
                        img.base64.startsWith("/uploads/"))
                ) {
                    try {
                        const url = new URL(img.base64, window.location.origin);
                        if (url.pathname.startsWith("/uploads/"))
                            return url.pathname.slice(1);
                    } catch {
                        if (img.base64.startsWith("/uploads/"))
                            return img.base64.replace(/^\//, "");
                        return img.base64;
                    }
                }
                // Otherwise, return as is (for new uploads)
                return img;
            });

        if (updateIdData?.id) {
            setInitialValues({
                productName: updateIdData.productName,
                productOverview: updateIdData.productOverview,
                images: normalizeImages(updateIdData.images), // <-- normalized here
                specifications: updateIdData.specifications || {},
                type: updateIdData.type,
                category: updateIdData.categoryName,
            });
            setIsProductFormOpen(true);
        } else {
            setInitialValues({
                productName: "",
                productOverview: "",
                images: [],
                specifications: {},
                type: "Imported Products",
                category: "",
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
            type: "Imported Products",
            category: "", // reset to empty for new product
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

        // Prepare files array: keep string for existing, object for new
        const files = (values.images || []).map((file: any) => {
            // If file is a string path (legacy)
            if (typeof file === "string" && file.startsWith("uploads/")) {
                return file;
            }
            // If file is an object with a url property (legacy)
            if (
                file?.url &&
                typeof file.url === "string" &&
                file.url.startsWith("uploads/")
            ) {
                return file.url;
            }
            // If file is an object with base64 and extension
            if (file?.base64 && file?.extension) {
                // If base64 is a URL (existing image), extract the path
                if (
                    typeof file.base64 === "string" &&
                    (file.base64.startsWith("http") ||
                        file.base64.startsWith("/uploads/"))
                ) {
                    // Extract just the path if it's a full URL
                    try {
                        const url = new URL(
                            file.base64,
                            window.location.origin
                        );
                        if (url.pathname.startsWith("/uploads/")) {
                            return url.pathname.slice(1); // remove leading slash
                        }
                    } catch {
                        // Not a valid URL, fallback
                        if (file.base64.startsWith("/uploads/")) {
                            return file.base64.replace(/^\//, "");
                        }
                        return file.base64;
                    }
                }
                // If base64 is a data URL or raw base64, treat as new image
                if (
                    typeof file.base64 === "string" &&
                    (file.base64.startsWith("data:") ||
                        /^[A-Za-z0-9+/=]{100,}/.test(file.base64))
                ) {
                    return {
                        extension: file.extension,
                        base64: file.base64,
                    };
                }
            }
            return file;
        });

        // Prepare payload for create
        const basePayload = {
            type: values.type, // always include type
            categoryId: selectedCategoryId,
            name: values.productName,
            description: values.productOverview,
            additionalInfo: values.specifications,
            files,
        };

        let success = false;

        try {
            if (updateIdData?.id) {
                // Always send all fields except files; use changed value if changed, else old value
                const changed: any = {
                    type:
                        values.type !== updateIdData.type
                            ? values.type
                            : updateIdData.type,
                    name:
                        values.productName !== updateIdData.productName
                            ? values.productName
                            : updateIdData.productName,
                    description:
                        values.productOverview !== updateIdData.productOverview
                            ? values.productOverview
                            : updateIdData.productOverview,
                    categoryId: selectedCategoryId, // always include categoryId
                    additionalInfo:
                        JSON.stringify(values.specifications) !==
                        JSON.stringify(updateIdData.specifications)
                            ? values.specifications
                            : updateIdData.specifications,
                };

                // Only send files if changed
                const prevFiles = (updateIdData.images || []).map((f: any) => {
                    if (typeof f === "string" && f.startsWith("uploads/"))
                        return f;
                    if (f?.base64 && f?.extension)
                        return { extension: f.extension, base64: f.base64 };
                    if (
                        f?.url &&
                        typeof f.url === "string" &&
                        f.url.startsWith("uploads/")
                    )
                        return f.url;
                    return f;
                });

                if (JSON.stringify(files) !== JSON.stringify(prevFiles)) {
                    changed.files = files;
                }

                // If nothing changed, don't send update
                const changedKeys = Object.keys(changed).filter(
                    (key) =>
                        key === "files" ||
                        (key === "categoryId"
                            ? changed[key] !== updateIdData.categoryId
                            : changed[key] !== updateIdData[key])
                );
                if (changedKeys.length === 0) {
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
        fetchData();
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

    // Filtering state for products table
    const [filterType, setFilterType] = useState("");
    const [filterCategory, setFilterCategory] = useState("");

    return (
        <div className='space-y-8'>
            <div className='flex justify-between items-center'>
                <h1>Products</h1>
                <Button onClick={handleCreateProduct} variant='submit'>
                    Create Product
                </Button>
            </div>

            {/* Category Table */}
            <div className='bg-white rounded shadow p-4'>
                <div className='flex justify-end '>
                    <Button
                        variant='submit'
                        onClick={() => setIsCategoryOverlayOpen(true)}
                    >
                        Add Category
                    </Button>
                </div>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead>
                        <tr>
                            <th className='px-4 py-2 text-left'>
                                Category Name
                            </th>
                            <th className='px-4 py-2 text-left'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(categoriesRaw || []).map((cat: any) => (
                            <tr key={cat.id}>
                                <td className='px-4 py-2'>{cat.value}</td>
                                <td className='px-4 py-2'>
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
                                </td>
                            </tr>
                        ))}
                        {categoriesRaw.length === 0 && (
                            <tr>
                                <td
                                    colSpan={2}
                                    className='px-4 py-2 text-gray-400 italic'
                                >
                                    No categories found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Products Data Table with filtering */}
            <div className='bg-white rounded shadow p-4'>
                <div className='flex flex-wrap gap-4 mb-4'>
                    <Dropdown
                        label='Filter by Type'
                        options={[
                            "",
                            "Imported Products",
                            "Manufactured Products",
                        ]}
                        value={filterType}
                        onChange={setFilterType}
                        placeholder='All Types'
                    />
                    <Dropdown
                        label='Filter by Category'
                        options={["", ...categories]}
                        value={filterCategory}
                        onChange={setFilterCategory}
                        placeholder='All Categories'
                    />
                </div>
                <ProductsData
                    setUpdateIdData={setUpdateIdData}
                    filterType={filterType}
                    filterCategory={filterCategory}
                />
            </div>

            {/* Product Form Overlay */}
            {isProductFormOpen && (
                <Overlay
                    isOpen={isProductFormOpen}
                    onClose={closeProductForm}
                    className='max-w-4xl'
                >
                    <div className='space-y-4 '>
                        <h1>
                            {updateIdData?.id
                                ? "Update Product"
                                : "Create Product"}
                        </h1>
                        <Formik
                            initialValues={initialValues}
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
                                        <MyEditor
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
                                        <MultipleUpload
                                            name='images'
                                            label=''
                                            placeholder='Add Multiple Images'
                                            value={updateIdData?.images}
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
