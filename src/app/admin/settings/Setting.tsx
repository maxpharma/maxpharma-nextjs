import React, { useState } from "react";
import { Formik, Form } from "formik";
import Input from "@/components/fields/Input";
import Button from "@/components/Button";

const Setting = () => {
    const [initialValues, setInitialValues] = useState({
        phoneNumber: "",
        phoneNumberII: "",
        mail: "",
        location: "",
        whatsAppNumber: "",
        copyrightText: "",
        facebookLink: "",
        instagramLink: "",
        twitterLink: "",
        linkedinLink: "",
        tiktokLink: "",
        youtubeLink: "",
    });

    const submitHandler = async (values: any, { resetForm }: any) => {
        console.log("Settings:", values);
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
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        <div>
                            <label className='block mb-2'>Phone Number</label>
                            <Input
                                name='phoneNumber'
                                label=''
                                type='text'
                                placeholder='+977'
                            />
                        </div>

                        <div>
                            <label className='block mb-2'>Mail</label>
                            <Input
                                name='mail'
                                label=''
                                type='email'
                                placeholder='someone@example.com'
                            />
                        </div>

                        <div>
                            <label className='block mb-2'>Location</label>
                            <Input
                                name='location'
                                label=''
                                type='text'
                                placeholder='Enter your location'
                            />
                        </div>

                        <div>
                            <label className='block mb-2'>
                                Phone Number II
                            </label>
                            <Input
                                name='phoneNumberII'
                                label=''
                                type='text'
                                placeholder='+977'
                            />
                        </div>

                        <div>
                            <label className='block mb-2'>
                                WhatsApp number
                            </label>
                            <Input
                                name='whatsAppNumber'
                                label=''
                                type='text'
                                placeholder='+977'
                            />
                        </div>
                    </div>

                    <div>
                        <label className='block mb-2'>Copyright Text</label>
                        <Input
                            name='copyrightText'
                            label=''
                            type='text'
                            placeholder='Copyright Text'
                        />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label className='block mb-2'>Facebook link</label>
                            <Input
                                name='facebookLink'
                                label=''
                                type='url'
                                placeholder='https://facebook.com'
                            />
                        </div>

                        <div>
                            <label className='block mb-2'>Instagram link</label>
                            <Input
                                name='instagramLink'
                                label=''
                                type='url'
                                placeholder='https://instagram.com'
                            />
                        </div>

                        <div>
                            <label className='block mb-2'>Twitter link</label>
                            <Input
                                name='twitterLink'
                                label=''
                                type='url'
                                placeholder='https://twitter.com'
                            />
                        </div>

                        <div>
                            <label className='block mb-2'>LinkedIn link</label>
                            <Input
                                name='linkedinLink'
                                label=''
                                type='url'
                                placeholder='https://linkedin.com'
                            />
                        </div>

                        <div>
                            <label className='block mb-2'>Tiktok link</label>
                            <Input
                                name='tiktokLink'
                                label=''
                                type='url'
                                placeholder='https://tiktok.com'
                            />
                        </div>

                        <div>
                            <label className='block mb-2'>Youtube link</label>
                            <Input
                                name='youtubeLink'
                                label=''
                                type='url'
                                placeholder='https://youtube.com'
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

export default Setting;
