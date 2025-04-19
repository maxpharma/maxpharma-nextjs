"use client";

import GeneralSettings from "@/api/generalSettings";
import ActionButton from "@/components/ActionButton";
import CustomToast from "@/components/CustomToast";
import Input from "@/components/fields/Input";
import TextArea from "@/components/fields/TextArea";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

// Define the form values interface
interface FormValues {
    title: string;
    description: string;
    keywords: string;
}

const SeoForm = () => {
    const [showToast, setShowToast] = useState(false);

    const [selectedPage, setSelectedPage] = useState({
        name: "Home",
        state: "homeSeo",
    });
    const [loading, setLoading] = useState(false);

    const formikRef = useRef<FormikProps<FormValues>>(null);

    const { data: storedData } = useSelector(
        (state: any) => state[selectedPage.state]
    );

    const fetchData = async () => {
        await GeneralSettings.getByKey(selectedPage.state, selectedPage.state);
    };

    console.log(storedData, "storedData");

    useEffect(() => {
        if (storedData) {
            setInitialValues({
                title: storedData?.infos?.title || "",
                description: storedData?.infos?.description || "",
                keywords: storedData?.infos?.keywords || "",
            });
        }
    }, [storedData]);

    const [initialValues, setInitialValues] = useState<FormValues>({
        title: "",
        description: "",
        keywords: "",
    });

    useEffect(() => {
        fetchData();
    }, [selectedPage.state]);

    const submitHandler = async (values: FormValues, { resetForm }: any) => {
        setLoading(true);

        const isUpdate = !!storedData?.id;
        const original = storedData || {};

        const payload = {
            group: "seo",
            key: selectedPage.state,
            value: "seo",
            title: "seo",
            infos: {
                ...values,
            },
        };

        try {
            if (isUpdate) {
                await GeneralSettings.update(
                    selectedPage.state,
                    payload,
                    original.id
                );
            } else {
                await GeneralSettings.create(selectedPage.state, payload);
                resetForm();
            }

            setShowToast(true);

            await fetchData();
        } catch (error) {
            console.error("Error saving data:", error);
        } finally {
            setLoading(false);
        }
    };

    const pages = [
        { name: "Home", state: "homeSeo" },
        { name: "Overview", state: "overviewSeo" },
        { name: "Message From Chairman", state: "messageFromChairmanSeo" },
        { name: "Origanization History", state: "organizationHistorySeo" },
        { name: "Imported Products", state: "importedProductsSeo" },
        { name: "Manufactured Products", state: "manufacturedProductsSeo" },
        { name: "Notice", state: "noticeSeo" },
        { name: "Production Department", state: "productionDepartmentSeo" },
        { name: "Quality Assurance", state: "qualityAssuranceSeo" },
        { name: "Quality Control", state: "qualityControlSeo" },
        { name: "Store & Logistics", state: "storeAndLogisticsSeo" },
        { name: "Gallery", state: "gallerySeo" },
        { name: "Contact", state: "contactSeo" },
    ];

    return (
        <>
            <div className='bg-light-blue p-4 rounded-lg mb-8'>
                <h1>Seo Settings</h1>
                <div className='flex gap-2 flex-wrap justify-center p-12'>
                    {pages.map((page, index) => (
                        <div
                            key={index}
                            className={`rounded-lg px-2 py-1 text-sm font-normal transition duration-200 cursor-pointer ${
                                selectedPage.state === page.state
                                    ? "bg-primary text-white"
                                    : "bg-white text-primary hover:bg-blue-100"
                            } `}
                            onClick={() => setSelectedPage(page)}
                        >
                            <span>{page.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                onSubmit={submitHandler}
                enableReinitialize={true}
            >
                {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Input name='title' label='Title' placeholder='Title' />
                        <TextArea
                            name='description'
                            label='Description'
                            placeholder='Description'
                        />
                        <TextArea
                            name='keywords'
                            label='Keywords'
                            placeholder='Keywords'
                        />
                        <ActionButton type='submit' loading={loading}>
                            {storedData?.id ? "Update" : "Save"}
                        </ActionButton>
                    </Form>
                )}
            </Formik>
            {showToast && (
                <CustomToast
                    title='Success'
                    message='Seo settings updated successfully'
                    onClose={() => setShowToast(false)}
                />
            )}
        </>
    );
};

export default SeoForm;
