import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import TextArea from "@/components/fields/TextArea";
import Upload from "@/components/fields/Upload";
import { Form, Formik } from "formik";
import React, { useState } from "react";

const Overview = ({ type }: any) => {
    const [initialValues, setInitialValues] = useState({
        title: "",
        description: "",
        images: [],
    });

    const submitHandler = async (values: any, { resetForm }: any) => {};

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
                        <Upload
                            name='images'
                            label='Upload Images'
                            placeholder='Upload Images'
                            className='flex-1'
                            variant='dashed'
                        />
                        <Upload
                            name='images'
                            label='Upload Images'
                            placeholder='Upload Images'
                            className='flex-1'
                        />
                    </div>
                    <Button variant='submit'>Submit</Button>
                </Form>
            </Formik>
        </div>
    );
};

export default Overview;
