"use client";

import AboutUs from "@/api/aboutUs";
import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import MyEditor from "@/components/fields/MyEditor";
import TextArea from "@/components/fields/TextArea";
import Upload from "@/components/fields/Upload";
import { FieldArray, Form, Formik } from "formik";
import { desc } from "framer-motion/client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Overview = ({ type }: { type: string }) => {
    const [loading, setLoading] = useState(false);
    const { items: aboutUsData } = useSelector(
        (state: any) => state.aboutUsOverview
    );

    const fetchData = async () => {
        await AboutUs.get("aboutUsOverview", type);
    };

    useEffect(() => {
        if (!aboutUsData?.length) {
            fetchData();
        }
    }, [aboutUsData?.length, type]);

    const [initialValues, setInitialValues] = useState({
        title: "",
        description: "",
        files: [],
    });

    useEffect(() => {
        if (aboutUsData?.length) {
            setInitialValues({
                title: aboutUsData[0]?.title || "",
                description: aboutUsData[0]?.description || "",
                files: aboutUsData[0]?.files || [],
            });
        }
    }, [aboutUsData?.length, aboutUsData]);

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);

        const isUpdate = aboutUsData?.length > 0 && aboutUsData[0]?.id;
        const original = aboutUsData?.[0] || {};

        // Always construct files array with both images (updated or previous)
        const filesToSend = [0, 1].map((index) => {
            const newFile = values.files[index];
            const oldFile = initialValues.files[index]; // always a string (path) or undefined

            // If newFile has base64, use it (new upload)
            if (newFile?.base64) {
                return {
                    extension: newFile.extension,
                    base64: newFile.base64,
                };
            }
            // Otherwise, use the old file path string (if exists)
            if (typeof oldFile === "string") {
                return oldFile;
            }
            return null;
        });

        // Check if any file has changed (newFile has base64)
        const filesChanged = [0, 1].some(
            (index) => values.files[index]?.base64
        );

        const defaultSend = {
            title: values.title,
            type: "Overview",
            description: values.description,
        };

        const getUpdatedFields = () => {
            const changed: any = {};
            if (!isUpdate) {
                changed.description = values.description;
                changed.files = filesToSend;
                changed.title = values.title;
                return changed;
            }
            if (values.title !== original.title) changed.title = values.title;
            if (values.description !== original.description)
                changed.description = values.description;
            if (filesChanged) {
                changed.files = filesToSend;
            }
            return changed;
        };

        const updatedFields = getUpdatedFields();
        const payload = { ...defaultSend, ...updatedFields };

        if (isUpdate && Object.keys(updatedFields).length === 0) {
            setLoading(false);
            return;
        }

        try {
            if (isUpdate) {
                await AboutUs.update("aboutUsOverview", original.id, payload);
            } else {
                await AboutUs.create("aboutUsOverview", payload);
                resetForm();
            }
        } catch (error) {
            console.error("Error submitting data:", error);
        }
        setLoading(false);
    };

    return (
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={submitHandler}
                enableReinitialize
            >
                <Form>
                    <Input
                        name='title'
                        label='Title'
                        placeholder='Enter title here'
                        type='text'
                    />
                    <MyEditor
                        name='description'
                        label='Description'
                        placeholder='Enter description here'
                    />
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
                                            value={initialValues.files[index]}
                                        />
                                    ))}
                                </>
                            )}
                        </FieldArray>
                    </div>
                    <Button variant='submit' loading={loading}>
                        Submit
                    </Button>
                </Form>
            </Formik>
        </div>
    );
};

export default Overview;
