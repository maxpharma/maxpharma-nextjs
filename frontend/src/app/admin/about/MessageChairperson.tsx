"use client";

import AboutUs from "@/api/aboutUs";
import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import MyEditor from "@/components/fields/MyEditor";
import Upload from "@/components/fields/Upload";
import CustomToast from "@/components/CustomToast";
import { Form, Formik } from "formik";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

const parseInfos = (infos: any) => {
    if (!infos) return { name: "", role: "" };
    if (typeof infos === "string") {
        try {
            return JSON.parse(infos);
        } catch {
            return { name: "", role: "" };
        }
    }
    return infos;
};

const MessageChairperson = ({ type }: any) => {
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const { items: chairpersonData } = useSelector(
        (state: any) => state.aboutUsMessageFromChairperson || {}
    );

    const fetchData = useCallback(async () => {
        try {
            await AboutUs.get("aboutUsMessageFromChairperson", type);
        } catch (error) {
            console.error("Error fetching chairperson data:", error);
        }
    }, [type]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const [initialValues, setInitialValues] = useState({
        id: "",
        profile: "",
        name: "",
        role: "",
        title: "",
        message: "",
    });

    useEffect(() => {
        if (chairpersonData?.length) {
            const item = chairpersonData[0];
            const parsedInfos = parseInfos(item?.infos);
            setInitialValues({
                id: item?.id ? String(item.id) : "",
                profile:
                    (item?.files && item?.files[0]) || "",
                name: parsedInfos?.name || "",
                role: parsedInfos?.role || "",
                title: item?.title || "",
                message: item?.description || "",
            });
        }
    }, [chairpersonData]);

    const submitHandler = async (values: any) => {
        setLoading(true);

        const currentItem = chairpersonData?.[0];
        const isUpdate = Boolean(currentItem?.id);

        const getFilesArray = () =>
            values.profile
                ? [
                      typeof values.profile === "string"
                          ? values.profile
                          : {
                                extension: values.profile.extension,
                                base64: values.profile.base64,
                            },
                  ]
                : [];

        const payload = {
            title: values.title,
            type: "Message From Chairperson",
            description: values.message,
            infos: {
                name: values.name,
                role: values.role,
            },
            files: getFilesArray(),
        };

        try {
            if (isUpdate) {
                await AboutUs.update(
                    "aboutUsMessageFromChairperson",
                    currentItem.id,
                    payload
                );
                setToastMessage("Message from Chairperson updated successfully");
            } else {
                await AboutUs.create("aboutUsMessageFromChairperson", payload);
                setToastMessage("Message from Chairperson created successfully");
            }
            setShowToast(true);
            await fetchData();
        } catch (error) {
            console.error("Error submitting data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Formik
                key={`${initialValues.id || "empty"}-${initialValues.title}`}
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
                        {initialValues.id ? "Update" : "Submit"}
                    </Button>
                </Form>
            </Formik>

            {showToast && (
                <CustomToast
                    title='Success'
                    message={toastMessage}
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
};

export default MessageChairperson;
