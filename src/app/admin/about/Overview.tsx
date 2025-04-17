"use client";

import AboutUs from "@/api/aboutUs";
import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import TextArea from "@/components/fields/TextArea";
import Upload from "@/components/fields/Upload";
import { FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Overview = ({ type }: { type: string }) => {
    const [loading, setLoading] = useState(false);
    const { items: aboutUsData } = useSelector((state: any) => state.aboutUs);

    console.log(type, "type");

    const fetchData = async () => {
        await AboutUs.get(type);
    };

    useEffect(() => {
        if (!aboutUsData?.length) {
            fetchData();
        }
    }, [aboutUsData?.length]);

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

    console.log(initialValues, "initialValues");

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);

        const payload = {
            title: values.title,
            description: values.description,
            type: "Overview",
            files: values.files.map((file: any) => ({
                extension: file?.extension,
                base64: file?.base64,
            })),
        };

        console.log(payload);

        try {
            await AboutUs.create(payload);
            resetForm();
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
                    <TextArea
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
