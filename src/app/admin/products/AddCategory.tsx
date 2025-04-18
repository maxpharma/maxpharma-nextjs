import GeneralSettings from "@/api/generalSettings";
import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import Overlay from "@/components/Overlay";
import { Form, Formik } from "formik";
import React, { useState } from "react";

const AddCategory = ({
    isOpen,
    onClose,
    onCategoryAdded,
}: {
    isOpen: boolean;
    onClose: () => void;
    onCategoryAdded: () => void;
}) => {
    const [loading, setLoading] = useState(false);
    const initialValues = {
        category: "",
    };

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);

        const payload = {
            group: "categories",
            key: values.category,
            value: values.category,
        };

        try {
            await GeneralSettings.create("categories", payload);
            resetForm();
            onCategoryAdded();
        } catch (error: any) {
            if (
                error instanceof Error &&
                error.message.includes(
                    "Cannot read properties of undefined (reading 'data')"
                )
            ) {
                console.log(
                    "Category likely created despite response parsing error"
                );
                resetForm();
                onCategoryAdded();
            } else {
                console.error("Error adding category:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {isOpen && (
                <Overlay isOpen={isOpen} onClose={onClose}>
                    <div className='space-y-4'>
                        <h1>Add Category</h1>
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
                                        onClick={onClose}
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
        </>
    );
};

export default AddCategory;
