import React, { use, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import Upload from "@/components/fields/Upload";
import TextArea from "@/components/fields/TextArea";
import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import Settings from "@/api/theme";
import { useSelector } from "react-redux";

const Theme = () => {
    const [loading, setLoading] = useState(false);
    const { items: themeSettings } = useSelector(
        (state: any) => state.themes || []
    );

    const fetchData = async () => {
        await Settings.get();
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
        const payload = {
            header: values.headerLogo
                ? {
                      extension: values.headerLogo.extension,
                      base64: values.headerLogo.base64,
                  }
                : initialValues.headerLogo,
            footer: values.footerLogo
                ? {
                      extension: values.footerLogo.extension,
                      base64: values.footerLogo.base64,
                  }
                : initialValues.footerLogo,
            footerText: values.footerText
                ? values.footerText
                : initialValues.footerText,
            primaryColor: values.primaryColor ? values.primaryColor : "#FFFFFF",
            primaryLightColor: values.primaryLightColor
                ? values.primaryLightColor
                : "#FFFFFF",
            secondaryColor: values.secondaryColor
                ? values.secondaryColor
                : "#FFFFFF",
        };

        try {
            await Settings.create(payload);
            resetForm();
        } catch (error: any) {
            console.error("Error adding Theme:", error);
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
