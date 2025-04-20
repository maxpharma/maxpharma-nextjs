"use client";

import Gallery from "@/api/gallery";
import ActionButton from "@/components/ActionButton";
import Input from "@/components/fields/Input";
import Upload from "@/components/fields/Upload";
import { Form, Formik, FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import ImageData from "./ImageData";
import Button from "@/components/Button";
import MultipleUpload from "@/components/fields/MultipleUpload";

interface FileData {
    extension: string;
    base64: string;
    fileName?: string;
    info?: string;
    type?: string;
    size?: number;
}

interface ImageFormValues {
    title: string;
    files: FileData[];
}

const ImageSection = () => {
    const [loading, setLoading] = useState(false);

    const [initialValues, setInitialValues] = useState<ImageFormValues>({
        title: "",
        files: [],
    });

    console.log(initialValues, "initialValues");

    const submitHandler = async (
        values: ImageFormValues,
        { resetForm }: FormikHelpers<ImageFormValues>
    ) => {
        setLoading(true);

        if (!values.files || values.files.length === 0) {
            console.error("No files uploaded");
            setLoading(false);
            return;
        }

        const payload = {
            title: values.title,
            files: values.files.map((file) => ({
                extension: file.extension,
                base64: file.base64,
            })),
        };

        try {
            await Gallery.uploadImage("gallery", payload);
        } catch (error) {
            console.error("Error uploading images:", error);
        } finally {
            setLoading(false);
            resetForm();
        }
    };

    return (
        <div className='bg-white py-6 rounded-lg space-y-4'>
            <h1>Upload Gallery Images</h1>
            <Formik
                initialValues={initialValues}
                onSubmit={submitHandler}
                enableReinitialize={true}
            >
                {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit} className='space-y-4'>
                        <Input
                            name='title'
                            label='Title'
                            placeholder='Enter title'
                            type='text'
                        />

                        <MultipleUpload name='files' label='Upload Images' />

                        <div className='flex justify-end mt-6'>
                            <Button variant='submit' loading={loading}>
                                Upload
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ImageSection;
