"use client";

import AboutUs from "@/api/aboutUs";
import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import MyEditor from "@/components/fields/MyEditor";
import TextArea from "@/components/fields/TextArea";
import Upload from "@/components/fields/Upload";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MessageChairperson = ({ type }: any) => {
    const [loading, setLoading] = useState(false);
    const { items: chairpersonData } = useSelector(
        (state: any) => state.aboutUsMessageFromChairperson
    );

    useEffect(() => {
        if (!chairpersonData?.length) {
            AboutUs.get("aboutUsMessageFromChairperson", type);
        }
    }, [chairpersonData?.length, type]);

    const [initialValues, setInitialValues] = useState({
        profile: "",
        name: "",
        role: "",
        title: "",
        message: "",
    });

    useEffect(() => {
        if (chairpersonData?.length) {
            setInitialValues({
                profile:
                    (chairpersonData[0]?.files &&
                        chairpersonData[0]?.files[0]) ||
                    "",
                name: chairpersonData[0]?.infos?.name || "",
                role: chairpersonData[0]?.infos?.role || "",
                title: chairpersonData[0]?.title || "",
                message: chairpersonData[0]?.description || "",
            });
        }
    }, [chairpersonData]);

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);

        const isUpdate = chairpersonData?.length > 0 && chairpersonData[0]?.id;
        const original = chairpersonData?.[0] || {};

        const defaultSend = {
            title: values.title,
            type: "Message From Chairperson",
            description: values.message,
        };

        const getFilesArray = () =>
            values.profile
                ? [
                      {
                          extension: values.profile.extension,
                          base64: values.profile.base64,
                      },
                  ]
                : [];

        const getUpdatedFields = () => {
            if (!isUpdate) {
                return {
                    infos: {
                        name: values.name,
                        role: values.role,
                    },
                    files: getFilesArray(),
                };
            }
            const changed: any = {};
            if (values.title !== original.title) changed.title = values.title;
            if (values.message !== original.description)
                changed.description = values.message;
            if (
                values.name !== original.infos?.name ||
                values.role !== original.infos?.role
            ) {
                changed.infos = {
                    name: values.name,
                    role: values.role,
                };
            }
            // Compare files array shallowly
            const origFile = (original.files && original.files[0]) || {};
            const currFile = values.profile || {};
            if (
                currFile.base64 &&
                (currFile.base64 !== origFile.base64 ||
                    currFile.extension !== origFile.extension)
            ) {
                changed.files = getFilesArray();
            }
            return changed;
        };

        const updatedFields = getUpdatedFields();
        const payload = { ...defaultSend, ...updatedFields };

        if (isUpdate && Object.keys(updatedFields).length === 0) {
            setLoading(false);
            return;
        }

        try {
            if (isUpdate) {
                await AboutUs.update(
                    "aboutUsMessageFromChairperson",
                    original.id,
                    payload
                );
            } else {
                await AboutUs.create("aboutUsMessageFromChairperson", payload);
                resetForm();
            }
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
                    <div className='flex gap-4 items-center'>
                        <Upload
                            name='profile'
                            label='Upload Profile Image'
                            className='h-full w-72'
                            value={initialValues.profile}
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
                    <MyEditor
                        name='message'
                        label='Message'
                        placeholder='Enter your message here...'
                    />

                    <Button variant='submit' loading={loading}>
                        Submit
                    </Button>
                </Form>
            </Formik>
        </div>
    );
};

export default MessageChairperson;
