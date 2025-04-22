import GeneralSettings from "@/api/generalSettings";
import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import Overlay from "@/components/Overlay";
import Categories from "@/features/Categories";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AddServiceCategory = () => {
    const [loading, setLoading] = useState(false);
    const [addCategoryOverlayOpen, setAddCategoryOverlayOpen] = useState(false);
    const [deleteCategoryOverlayOpen, setDeleteCategoryOverlayOpen] =
        useState(false);
    const initialValues = {
        category: "",
    };

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);

        const payload = {
            group: "serviceCategories",
            key: Date.now().toString(),

            value: values.category,
            infos: {
                state:
                    values.category
                        .split(" ")
                        .map((word: string, idx: any) =>
                            idx === 0
                                ? word.charAt(0).toLowerCase() + word.slice(1)
                                : word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join("") + "Seo",
                seoUrl: values.category.replace(/\s+/g, "-").toLowerCase(),
            },
        };

        try {
            await GeneralSettings.create("serviceCategories", payload);
            resetForm();
        } catch (error: any) {
            if (
                error instanceof Error &&
                error.message.includes(
                    "Cannot read properties of undefined (reading 'data')"
                )
            ) {
                resetForm();
            } else {
                console.error("Error adding service category:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    // Service Categories

    const { data: serviceCategories } = useSelector(
        (state: any) => state.serviceCategories || []
    );

    const fetchCategories = async () => {
        await GeneralSettings.getByGroup(
            "serviceCategories",
            "serviceCategories"
        );
    };

    useEffect(() => {
        if (!serviceCategories?.length) {
            fetchCategories();
        }
    }, [serviceCategories?.length]);

    const handleDeleteCategory = async (categoryId: any) => {
        setLoading(true);
        try {
            await GeneralSettings.remove("serviceCategories", categoryId);
        } catch (error: any) {
            console.error("Error deleting service category:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='flex  gap-4'>
                <button
                    className='active-button'
                    onClick={() => setDeleteCategoryOverlayOpen(true)}
                >
                    Edit Categories
                </button>
                <button
                    className='active-button'
                    onClick={() => setAddCategoryOverlayOpen(true)}
                >
                    + Add Categories
                </button>
            </div>
            {addCategoryOverlayOpen && (
                <Overlay
                    isOpen={addCategoryOverlayOpen}
                    onClose={() => setAddCategoryOverlayOpen(false)}
                >
                    <div className='space-y-4'>
                        <h1>Add Service Category</h1>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={submitHandler}
                        >
                            <Form>
                                <Input
                                    name='category'
                                    label='Add new Category'
                                    placeholder='Category'
                                />
                                <div className='flex gap-4'>
                                    <Button variant='submit' loading={loading}>
                                        Add Category
                                    </Button>
                                    <button
                                        type='button'
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
            {deleteCategoryOverlayOpen && (
                <Overlay
                    isOpen={deleteCategoryOverlayOpen}
                    onClose={() => setDeleteCategoryOverlayOpen(false)}
                >
                    <div className='space-y-4'>
                        <h1>Edit Service Categories</h1>
                        <div className='flex flex-col gap-2 max-h-64 overflow-y-auto'>
                            {serviceCategories &&
                            serviceCategories.length > 0 ? (
                                serviceCategories.map((cat: any) => (
                                    <div
                                        key={cat.key}
                                        className='flex items-center justify-between border-b py-2'
                                    >
                                        <span>{cat.value}</span>
                                        <button
                                            className='px-3 py-1 bg-red-400 text-white rounded cursor-pointer'
                                            onClick={() =>
                                                handleDeleteCategory(cat.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div>No categories found.</div>
                            )}
                        </div>
                    </div>
                </Overlay>
            )}
        </div>
    );
};

export default AddServiceCategory;
