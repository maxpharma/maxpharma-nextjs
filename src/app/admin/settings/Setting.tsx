import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import Input from "@/components/fields/Input";
import Button from "@/components/Button";
import GeneralSettings from "@/api/generalSettings";
import { useSelector } from "react-redux";

const Setting = () => {
    const [loading, setLoading] = useState(false);
    const { data: settingsData } = useSelector((state: any) => state.settings);

    const fetchData = async () => {
        await GeneralSettings.getByGroup("settings", "max-pharma-settings");
    };

    useEffect(() => {
        if (!settingsData?.length) {
            fetchData();
        }
    }, [settingsData?.length]);

    console.log(settingsData, "settingsData");

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

    // Set initial values from settingsData[0]?.infos if available
    useEffect(() => {
        if (settingsData?.length && settingsData[0]?.infos) {
            setInitialValues({
                ...initialValues,
                ...settingsData[0].infos,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settingsData]);

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);

        const isUpdate = settingsData?.length > 0 && settingsData[0]?.id;
        const original = settingsData?.[0] || {};

        const payload = {
            group: "max-pharma-settings",
            key: "max-pharma-settings",
            title: "Settings",
            value: "settings",
            infos: {
                ...values,
            },
        };

        try {
            if (isUpdate) {
                await GeneralSettings.update("settings", payload, original.id);
            } else {
                await GeneralSettings.create("settings", payload);
                resetForm();
            }
        } catch (error) {
            console.error("Error saving settings:", error);
        }
        setLoading(false);
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
                        <Button loading={loading} variant='submit'>
                            Save
                        </Button>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default Setting;
