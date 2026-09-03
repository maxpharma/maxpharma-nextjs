"use client";

import Documents from "@/api/notice";
import ActionButton from "@/components/ActionButton";

import CustomDate from "@/components/fields/CustomDate";
import Input from "@/components/fields/Input";
import Upload from "@/components/fields/Upload";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import DocumentsData from "./DocumentsData";
import Dropdown from "@/components/fields/Dropdown";

interface DocumentType {
    id: number;
    title: string;
    type: string;
    date: string;
    file: string;
}

const DocumentsPage = () => {
    const [updateIdData, setUpdateIdData] = useState<DocumentType | null>(null);
    const [loading, setLoading] = useState(false);

    const documentOptions = ["Important Notice", "Career Notice"];

    const [initialValues, setInitialValues] = useState({
        title: "",
        type: "",

        documentType: "",
        date: "",
        file: {
            base64: "",
            extension: "",
        },
    });

    useEffect(() => {
        if (updateIdData?.id) {
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }, 100);
            setInitialValues({
                title: updateIdData?.title,
                type: updateIdData?.type,
                documentType: updateIdData?.type,
                date: updateIdData?.date,
                file: {
                    base64: `${process.env.NEXT_PUBLIC_BUCKET_URL}/${updateIdData?.file}`,
                    extension: updateIdData?.file.split(".").pop() || "",
                },
            });
        } else {
            setInitialValues({
                title: "",
                type: "",
                documentType: "",
                date: "",
                file: {
                    base64: "",
                    extension: "",
                },
            });
        }
    }, [
        updateIdData?.id,
        updateIdData?.file,
        updateIdData,
        updateIdData?.type,
    ]);

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);

        let filePayload: any = undefined;
        if (values.file?.base64) {
            if (values.file.base64.startsWith("data:")) {
                filePayload = {
                    base64: values.file.base64,
                    extension: values.file.extension,
                };
            } else {
                filePayload = values.file.base64;
            }
        } else if (typeof values.file === "string") {
            filePayload = values.file;
        }

        const payload = {
            title: values.title,
            documentType: values.documentType,
            date: values.date,
            ...(filePayload ? { file: filePayload } : {}),
        };
        resetForm();

        try {
            if (updateIdData?.id) {
                await Documents.update("documents", payload, updateIdData?.id);
            } else {
                await Documents.create(payload);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setUpdateIdData(null);
            setLoading(false);
        }
    };

    return (
        <>
            <div className='space-y-6'>
                <Formik
                    initialValues={initialValues}
                    onSubmit={submitHandler}
                    enableReinitialize={true}
                >
                    {({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <div className='flex gap-4'>
                                <Dropdown
                                    name='documentType'
                                    label='Document Type'
                                    options={documentOptions}
                                    placeholder='Select Document Type'
                                    className='flex-1'
                                />
                                <Input
                                    name='title'
                                    label='Title'
                                    placeholder='Enter title'
                                    className='flex-1'
                                />
                            </div>
                            <div className='flex gap-4'>
                                <CustomDate
                                    name='date'
                                    label='Date'
                                    placeholder='Select Date'
                                    className='w-1/2'
                                />
                                <Upload
                                    variant='input'
                                    name='file'
                                    label='Upload File'
                                    placeholder='Upload File'
                                    acceptFiles={true}
                                    className='w-1/2'
                                    value={
                                        updateIdData?.file
                                            ? `${process.env.NEXT_PUBLIC_BUCKET_URL}/${updateIdData?.file}`
                                            : null
                                    }
                                />
                            </div>
                            <ActionButton
                                loading={loading}
                                type='submit'
                                classname='flex justify-self-end'
                            >
                                {updateIdData?.id ? "Update" : "Save"}
                            </ActionButton>
                        </Form>
                    )}
                </Formik>
                <DocumentsData setUpdateIdData={setUpdateIdData} />
            </div>
        </>
    );
};

export default DocumentsPage;
