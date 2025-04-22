"use client";

import GeneralSettings from "@/api/generalSettings";
import ActionButton from "@/components/ActionButton";
import CustomToast from "@/components/CustomToast";
import Input from "@/components/fields/Input";
import TextArea from "@/components/fields/TextArea";
import { Form, Formik, FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
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

    const { data: serviceCategoriesRaw } = useSelector(
        (state: any) => state.serviceCategories || {}
    );

    const fetchServiceCategoriesData = async () => {
        await GeneralSettings.getByGroup(
            "serviceCategories",
            "serviceCategories"
        );
    };

    useEffect(() => {
        if (!serviceCategoriesRaw?.length) {
            fetchServiceCategoriesData();
        }
    }, [serviceCategoriesRaw?.length]);

    const { data: seoData } = useSelector((state: any) => state.seo);

    const serviceCategories = serviceCategoriesRaw?.map((item: any) => ({
        name: item?.value,
        state: item?.infos?.state,
    }));

    const fetchData = async () => {
        await GeneralSettings.getByGroup("seo", "seo");
    };

    useEffect(() => {
        if (seoData?.length) {
            const currentSeoData = seoData.find(
                (item: any) => item.key === selectedPage.state
            );
            if (currentSeoData) {
                setInitialValues({
                    title: currentSeoData?.infos?.title || "",
                    description: currentSeoData?.infos?.description || "",
                    keywords: currentSeoData?.infos?.keywords || "",
                });
            }
        }
    }, [seoData, selectedPage.state]);

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

        const isUpdate = !!seoData?.id;
        const original = seoData || {};

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
        { name: "Gallery", state: "gallerySeo" },
        { name: "Contact", state: "contactSeo" },
        ...serviceCategories,
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
                            {seoData?.id ? "Update" : "Save"}
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
