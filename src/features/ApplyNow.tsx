"use client";

import Applies from "@/api/applies";
import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import PhoneInput from "@/components/fields/Phone";
import TextArea from "@/components/fields/TextArea";
import Upload from "@/components/fields/Upload";
import { Form, Formik } from "formik";
import React, { useState } from "react";

const ApplyNow = ({
    id,
    onSuccess,
}: {
    id: number | null;
    onSuccess?: () => void;
}) => {
    const [loading, setLoading] = useState(false);
    const initialValues = {
        name: "",
        phone: "",
        email: "",
        file: "",
        location: "",
        message: "",
    };

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);

        const payload = {
            noticeId: id,
            name: values?.name,
            phone: values?.phone,
            email: values?.email,
            location: values?.location,
            message: values?.message,
            file: values?.file
                ? {
                      base64: values?.file.base64,
                      extension: values?.file.extension,
                  }
                : undefined,
        };

        try {
            await Applies.create(payload);
            resetForm();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error submitting form:", error);
        }

        setLoading(false);
    };

    return (
        <div className='space-y-4 '>
            <h1>Interested in Our Products</h1>
            <Formik initialValues={initialValues} onSubmit={submitHandler}>
                <Form>
                    <div className='flex gap-4 flex-col sm:flex-row'>
                        <Input
                            name='name'
                            label='Name'
                            placeholder='Enter your name'
                            required
                            className='flex-1'
                        />
                        <PhoneInput
                            name='phone'
                            label='Contact Number'
                            placeholder='Phone Number'
                            required
                            className='flex-1'
                        />
                    </div>
                    <div className='flex gap-4 flex-col sm:flex-row'>
                        <Input
                            name='email'
                            label='Email'
                            placeholder='Enter your email'
                            type='email'
                            required
                            className='flex-1'
                        />
                        <Input
                            name='location'
                            label='Location'
                            placeholder='Enter your Location'
                            required
                            className='flex-1'
                        />
                    </div>
                    <Upload
                        variant='dashed'
                        name='file'
                        label='Upload Supporting Documents(CV/Resume)'
                        acceptFiles={true}
                        placeholder='Upload your Resume or CV '
                    />
                    <TextArea
                        name='message'
                        label='Message'
                        placeholder='Enter your message'
                        required
                    />
                    <Button loading={loading} variant='submit'>
                        Send Message
                    </Button>
                </Form>
            </Formik>
        </div>
    );
};

export default ApplyNow;
