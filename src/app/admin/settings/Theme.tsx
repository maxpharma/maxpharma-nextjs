import React, { use, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import Upload from "@/components/fields/Upload";
import TextArea from "@/components/fields/TextArea";
import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import { useSelector } from "react-redux";
import ThemeApi from "@/api/theme";

const Theme = () => {
    const [loading, setLoading] = useState(false);
    const { items: themeSettings } = useSelector(
        (state: any) => state.themes || []
    );

    const fetchData = async () => {
        await ThemeApi.get();
    };

    useEffect(() => {
        if (!themeSettings?.length) {
            fetchData();
        }
    }, [themeSettings?.length]);

    const [initialValues, setInitialValues] = useState({
        headerLogo: "",
        footerLogo: "",
        footerText: "",
        primaryColor: "#FFFFFF",
        primaryLightColor: "#FFFFFF",
        secondaryColor: "#FFFFFF",
    });

    console.log(initialValues, "initialValues");

    useEffect(() => {
        if (themeSettings?.length) {
            setInitialValues({
                headerLogo: themeSettings[0]?.header || "",
                footerLogo: themeSettings[0]?.footer || "",
                footerText: themeSettings[0]?.footerText || "",
                primaryColor: themeSettings[0]?.primaryColor || "#FFFFFF",
                primaryLightColor:
                    themeSettings[0]?.primaryLightColor || "#FFFFFF",
                secondaryColor: themeSettings[0]?.secondaryColor || "#FFFFFF",
            });
        }
    }, [themeSettings]);

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);

        const isUpdate = themeSettings?.length > 0 && themeSettings[0]?.id;
        const original = themeSettings?.[0] || {};

        // Helper to compare logo fields (object or string)
        const isLogoChanged = (newLogo: any, origLogo: any) => {
            if (!newLogo && !origLogo) return false;
            if (typeof newLogo === "string" && typeof origLogo === "string") {
                return newLogo !== origLogo;
            }
            if (typeof newLogo === "object" && typeof origLogo === "object") {
                return (
                    newLogo.base64 !== origLogo.base64 ||
                    newLogo.extension !== origLogo.extension
                );
            }
            return true;
        };

        const getPayload = () => {
            const payload: any = {
                footerText: values.footerText,
                primaryColor: values.primaryColor,
                primaryLightColor: values.primaryLightColor,
                secondaryColor: values.secondaryColor,
            };

            // Header Logo
            if (
                !isUpdate ||
                isLogoChanged(values.headerLogo, original.header)
            ) {
                payload.header = values.headerLogo
                    ? {
                          extension: values.headerLogo.extension,
                          base64: values.headerLogo.base64,
                      }
                    : "";
            }

            // Footer Logo
            if (
                !isUpdate ||
                isLogoChanged(values.footerLogo, original.footer)
            ) {
                payload.footer = values.footerLogo
                    ? {
                          extension: values.footerLogo.extension,
                          base64: values.footerLogo.base64,
                      }
                    : "";
            }

            return payload;
        };

        const payload = getPayload();

        // For update, if only the always-included fields are present and unchanged, skip update
        if (
            isUpdate &&
            !isLogoChanged(values.headerLogo, original.header) &&
            !isLogoChanged(values.footerLogo, original.footer) &&
            values.footerText === original.footerText &&
            values.primaryColor === original.primaryColor &&
            values.primaryLightColor === original.primaryLightColor &&
            values.secondaryColor === original.secondaryColor
        ) {
            setLoading(false);
            return;
        }

        try {
            if (isUpdate) {
                await ThemeApi.update(original.id, payload);
            } else {
                await ThemeApi.create(payload);
                resetForm();
            }
        } catch (error: any) {
            console.error("Error submitting Theme:", error);
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
                    <div className='space-y-4'>
                        <label className='block'>Header Logo</label>
                        <Upload
                            name='headerLogo'
                            label=''
                            placeholder='Upload Logo'
                            value={initialValues.headerLogo}
                        />
                    </div>

                    <div className='space-y-4'>
                        <label className='block'>Header Logo</label>
                        <Upload
                            name='footerLogo'
                            label=''
                            placeholder='Upload Logo'
                            value={initialValues.footerLogo}
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
                        <Button loading={loading} variant='submit'>
                            Save
                        </Button>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default Theme;
