"use client";

import AboutUs from "@/api/aboutUs";
import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import MyEditor from "@/components/fields/MyEditor";
import Upload from "@/components/fields/Upload";
import CustomToast from "@/components/CustomToast";
import { FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

const Overview = ({ type }: { type: string }) => {
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const { items: aboutUsData } = useSelector(
        (state: any) => state.aboutUsOverview || {}
    );

    const fetchData = useCallback(async () => {
        try {
            await AboutUs.get("aboutUsOverview", type);
        } catch (error) {
            console.error("Error fetching overview data:", error);
        }
    }, [type]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const [initialValues, setInitialValues] = useState({
        id: "",
        title: "",
        description: "",
        files: [] as any[],
    });

    useEffect(() => {
        if (aboutUsData?.length) {
            const item = aboutUsData[0];
            setInitialValues({
                id: item?.id ? String(item.id) : "",
                title: item?.title || "",
                description: item?.description || "",
                files: Array.isArray(item?.files) ? item.files : [],
            });
        }
    }, [aboutUsData]);

    const submitHandler = async (values: any) => {
        setLoading(true);

        const currentItem = aboutUsData?.[0];
        const isUpdate = Boolean(currentItem?.id);

        const filesToSend = [0, 1].map((index) => {
            const newFile = values.files?.[index];
            const oldFile = initialValues.files?.[index];

            if (newFile?.base64) {
                return {
                    extension: newFile.extension,
                    base64: newFile.base64,
                };
            }
            if (typeof oldFile === "string") {
                return oldFile;
            }
            return null;
        });

        const payload = {
            title: values.title,
            type: "Overview",
            description: values.description,
            files: filesToSend,
        };

        try {
            if (isUpdate) {
                await AboutUs.update("aboutUsOverview", currentItem.id, payload);
                setToastMessage("Overview updated successfully");
            } else {
                await AboutUs.create("aboutUsOverview", payload);
                setToastMessage("Overview created successfully");
            }
            setShowToast(true);
            await fetchData();
        } catch (error) {
            console.error("Error submitting data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Formik
                key={`${initialValues.id || "empty"}-${initialValues.title}`}
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
                        {initialValues.id ? "Update" : "Submit"}
                    </Button>
                </Form>
            </Formik>

            {showToast && (
                <CustomToast
                    title='Success'
                    message={toastMessage}
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
};

export default Overview;
