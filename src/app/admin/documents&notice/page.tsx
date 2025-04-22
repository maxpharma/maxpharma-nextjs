"use client";

import Documents from "@/api/notice";
import ActionButton from "@/components/ActionButton";
import Dropdown from "@/components/ui/Dropdown";

import CustomDate from "@/components/fields/CustomDate";
import Input from "@/components/fields/Input";
import Upload from "@/components/fields/Upload";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import DocumentsData from "./DocumentsData";

interface DocumentType {
    id: number;
    title: string;
    type: string;
    date: string;
    file: string;
}

const DocumentsPage = () => {
    const [updateIdData, setUpdateIdData] = useState<DocumentType | null>(null);
    const [dropdownValue, setDropdownValue] = useState("");
    const [loading, setLoading] = useState(false);

    const documentOptions = ["Important Notice", "Career Notice"];

    const handleDocumentTypeChange = (selectedOption: string) => {
        setDropdownValue(selectedOption);
    };
    const [initialValues, setInitialValues] = useState({
        title: "",
        type: "",
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
                date: updateIdData?.date,
                file: {
                    base64: `${process.env.NEXT_PUBLIC_BUCKET_URL}/${updateIdData?.file}`,
                    extension: updateIdData?.file.split(".").pop() || "",
                },
            });
            setDropdownValue(updateIdData?.type);
        } else {
            setInitialValues({
                title: "",
                type: "",
                date: "",
                file: {
                    base64: "",
                    extension: "",
                },
            });
            setDropdownValue("");
        }
    }, [
        updateIdData?.id,
        updateIdData?.file,
        updateIdData,
        updateIdData?.type,
    ]);

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);

        const payload = {
            title: values.title,
            documentType: dropdownValue,
            date: values.date,
            file: {
                base64: values.file.base64,
                extension: values.file.extension,
            },
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
                                    className='w-1/2'
                                />
                                <Input
                                    name='title'
                                    label='Title'
                                    placeholder='Enter title'
                                    className='w-1/2'
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
