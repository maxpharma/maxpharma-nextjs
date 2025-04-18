"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, FieldArray } from "formik";
import Input from "@/components/fields/Input";
import TextArea from "@/components/fields/TextArea";
import Upload from "@/components/fields/Upload";
import Button from "@/components/Button";
import Overlay from "@/components/Overlay";
import { useSelector } from "react-redux";
import GeneralSettings from "@/api/generalSettings";
import { Trash2 } from "lucide-react";
import AddServiceCategory from "./AddServiceCategory";
import Services from "@/api/services";
import MyEditor from "@/components/fields/MyEditor";

const ServicePage = () => {
    const { data: serviceCategories } = useSelector(
        (state: any) => state.serviceCategories || []
    );

    const { items: servicesData } = useSelector(
        (state: any) => state.services || []
    );

    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [initialValues, setInitialValues] = useState({
        title: "",
        description: "",
        files: [],
    });

    useEffect(() => {
        if (servicesData?.length) {
            setInitialValues({
                title: servicesData[0]?.title || "",
                description: servicesData[0]?.description || "",
                files: servicesData[0]?.files || [],
            });
        } else {
            setInitialValues({
                title: "",
                description: "",
                files: [],
            });
        }
    }, [servicesData, selectedCategory?.id]);

    const [isEditCategoriesOpen, setIsEditCategoriesOpen] = useState(false);
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

    const fetchCategories = async () => {
        await GeneralSettings.getByGroup(
            "serviceCategories",
            "serviceCategories"
        );
    };

    const fetchServicesData = async () => {
        console.log(selectedCategory?.id, "selectedCategory");

        const response = await Services.get(selectedCategory?.id);
        console.log("response", response);
    };

    useEffect(() => {
        if (selectedCategory?.id) {
            fetchServicesData();
        }
    }, [selectedCategory, selectedCategory?.id]);

    console.log("servicesData", servicesData);

    useEffect(() => {
        if (!serviceCategories?.length) {
            fetchCategories();
        }
    }, [serviceCategories?.length]);

    useEffect(() => {
        if (serviceCategories.length && !selectedCategory) {
            setSelectedCategory(serviceCategories[0]);
        }
    }, [serviceCategories, selectedCategory]);

    const handleCategoryClick = (category: any) => {
        setSelectedCategory(category);
    };

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);
        const payload = {
            title: values.title,
            description: values.description,
            files: values.files.map((file: any) => ({
                extension: file?.extension,
                base64: file?.base64,
            })),
            categoryId: selectedCategory?.id,
        };

        try {
            await Services.create(payload);
            resetForm();
        } catch (error) {
            console.error("Error creating service:", error);
        }
        setLoading(false);
    };

    const handleDeleteCategory = async (id: number) => {
        setDeleteLoading(id);
        try {
            await GeneralSettings.remove("serviceCategories", id);
            await fetchCategories();
        } catch (err) {
            console.error("Error deleting category:", err);
        } finally {
            setDeleteLoading(null);
        }
    };

    return (
        <div className='space-y-6'>
            <h1>Add Services</h1>

            <div className='flex justify-between items-center'>
                <div className='flex flex-wrap gap-2 items-center'>
                    {serviceCategories.map((category: any) => (
                        <button
                            key={category.id}
                            className={`px-4 py-2 rounded-md ${
                                selectedCategory?.id === category.id
                                    ? "active-button"
                                    : "inactive-button"
                            }`}
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category?.value}
                        </button>
                    ))}
                </div>
                <div className='flex gap-2'>
                    <button
                        className='py-1 px-3 text-sm rounded-full border border-primary text-primary flex items-center gap-1'
                        onClick={() => setIsEditCategoriesOpen(true)}
                    >
                        Edit Categories
                    </button>
                    <button
                        className='py-1 px-3 text-sm rounded-full border border-primary text-primary flex items-center gap-1'
                        onClick={() => setIsAddCategoryOpen(true)}
                    >
                        Add Category
                        <span className='ml-1 text-xl'>+</span>
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
                            Edit Service Categories
                        </h2>
                        <ul className='divide-y'>
                            {(serviceCategories || []).map((cat: any) => (
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

            <Formik
                initialValues={initialValues}
                onSubmit={submitHandler}
                enableReinitialize
            >
                <Form className='space-y-4'>
                    <Input
                        name='title'
                        placeholder='Title'
                        label={selectedCategory?.value}
                        type='text'
                    />

                    <MyEditor
                        name='description'
                        label='Description'
                        placeholder='Description'
                    />

                    <div>
                        <label className='block mb-2 font-medium'>
                            Banner Images
                        </label>
                        <div className='flex gap-4 w-full'>
                            <FieldArray name='files'>
                                {() => (
                                    <>
                                        {[0, 1].map((index) => (
                                            <Upload
                                                key={index}
                                                name={`files[${index}]`}
                                                label='Upload Images'
                                                placeholder='Upload Images'
                                                className='flex-1'
                                                variant='dashed'
                                                size={200}
                                                value={
                                                    initialValues.files[index]
                                                }
                                            />
                                        ))}
                                    </>
                                )}
                            </FieldArray>
                        </div>
                    </div>

                    <div className='flex justify-end'>
                        <Button variant='submit'>Save</Button>
                    </div>
                </Form>
            </Formik>

            {/* AddServiceCategory Overlay */}
            <AddServiceCategory
                isOpen={isAddCategoryOpen}
                onClose={() => setIsAddCategoryOpen(false)}
                onCategoryAdded={() => {
                    setIsAddCategoryOpen(false);
                    fetchCategories();
                }}
            />
        </div>
    );
};

export default ServicePage;
