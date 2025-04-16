import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import TextArea from "@/components/fields/TextArea";
import Upload from "@/components/fields/Upload";
import { Form, Formik } from "formik";
import React, { useState } from "react";

const MessageChairperson = ({ type }: any) => {
    const [initialValues, setInitialValues] = useState({
        profile: "",
        name: "",
        role: "",
        title: "",
        message: "",
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
                    <div className='flex gap-4 items-center'>
                        <Upload
                            name='profile'
                            label='Upload Profile Image'
                            className='h-full w-72'
                        />
                        <div className='flex-1'>
                            <Input
                                name='name'
                                label='Name'
                                placeholder='Enter name here'
                                type='text'
                            />
                            <Input
                                name='role'
                                label='Role'
                                placeholder='Enter role here'
                                type='text'
                            />
                        </div>
                    </div>

                    <Input
                        name='title'
                        label='Title'
                        placeholder='Enter title here'
                    />
                    <TextArea
                        name='message'
                        label='Message'
                        placeholder='Enter your message here'
                    />

                    <Button variant='submit'>Submit</Button>
                </Form>
            </Formik>
        </div>
    );
};

export default MessageChairperson;
