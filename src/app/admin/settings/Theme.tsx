import React, { useState } from "react";
import { Formik, Form } from "formik";
import Upload from "@/components/fields/Upload";
import TextArea from "@/components/fields/TextArea";
import Button from "@/components/Button";
import Input from "@/components/fields/Input";

const Theme = () => {
    const [initialValues, setInitialValues] = useState({
        headerLogo1: "",
        headerLogo2: "",
        footerText: "",
        primaryColor: "#FFFFFF",
        primaryLightColor: "#FFFFFF",
        secondaryColor: "#FFFFFF",
    });

    const submitHandler = async (values: any, { resetForm }: any) => {
        console.log("Theme settings:", values);
        // Handle submission logic here
    };

    return (
        <div className='space-y-6'>
            <Formik
                initialValues={initialValues}
                onSubmit={submitHandler}
                enableReinitialize
            >
                <Form className='space-y-6'>
                    <div className='space-y-4'>
                        <label className='block'>Header Logo</label>
                        <Upload
                            name='headerLogo1'
                            label=''
                            placeholder='Upload Logo'
                        />
                    </div>

                    <div className='space-y-4'>
                        <label className='block'>Header Logo</label>
                        <Upload
                            name='headerLogo2'
                            label=''
                            placeholder='Upload Logo'
                        />
                    </div>

                    <div className='space-y-4'>
                        <label className='block'>Footer Text</label>
                        <TextArea name='footerText' label='' placeholder='' />
                    </div>

                    <div className='grid grid-cols-3 gap-4'>
                        <div>
                            <label className='block mb-2'>Primary Color</label>
                            <Input
                                name='primaryColor'
                                label=''
                                type='text'
                                placeholder='#FFFFFF'
                            />
                        </div>
                        <div>
                            <label className='block mb-2'>
                                Primary Light Color
                            </label>
                            <Input
                                name='primaryLightColor'
                                label=''
                                type='text'
                                placeholder='#FFFFFF'
                            />
                        </div>
                        <div>
                            <label className='block mb-2'>
                                Secondary Color
                            </label>
                            <Input
                                name='secondaryColor'
                                label=''
                                type='text'
                                placeholder='#FFFFFF'
                            />
                        </div>
                    </div>

                    <div className='flex justify-end'>
                        <Button variant='submit'>Save</Button>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default Theme;
