"use client";

import GeneralSettings from "@/api/generalSettings";
import ActionButton from "@/components/ActionButton";
import Input from "@/components/fields/Input";
import Upload from "@/components/fields/Upload";
import Overlay from "@/components/Overlay";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import BannerData from "./BannerData";
import { update } from "@/store/actions";

interface BannerType {
    id: number;
    key: string;
    title: string;
    link: string;
    file: string;
}

const Banner = () => {
    const [updateIdData, setUpdateIdData] = useState<BannerType | null>(null);
    console.log("updateIdData", updateIdData);
    const [loading, setLoading] = useState(false);
    const [isBannerFormOpen, setIsBannerFormOpen] = useState(false);

    const [initialValues, setInitialValues] = useState({
        title: "",
        link: "",
        file: "",
    });

    useEffect(() => {
        if (updateIdData?.id) {
            setInitialValues({
                title: updateIdData?.title,
                link: updateIdData?.link,
                file: `${process.env.NEXT_PUBLIC_BUCKET_URL}/${updateIdData?.file}`,
            });
            setIsBannerFormOpen(true);
        } else {
            setInitialValues({
                title: "",
                link: "",
                file: "",
            });
        }
    }, [updateIdData]);

    const handleCreateBanner = () => {
        setUpdateIdData(null);
        setInitialValues({
            title: "",
            link: "",
            file: "",
        });
        setIsBannerFormOpen(true);
    };

    const closeBannerForm = () => {
        setIsBannerFormOpen(false);
        setUpdateIdData(null);
    };

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);

        const defaultSend = {
            group: "banner",
            key: updateIdData?.key || `banner-${Date.now()}`,
            value: updateIdData?.link || values.link,
        };

        // Helper: check what changed
        const getUpdatedFields = () => {
            if (!updateIdData?.id) return values; // New entry: send all fields

            const changed: any = {};

            if (values.title !== updateIdData.title)
                changed.title = values.title;
            if (values.link !== updateIdData.link) changed.value = values.link;

            // If file is a new one (not a string), assume it's changed
            if (
                values.file &&
                typeof values.file !== "string" &&
                values.file.base64
            ) {
                changed.file = {
                    extension: values.file.extension,
                    base64: values.file.base64,
                };
            }

            return changed;
        };

        const updatedFields = getUpdatedFields();
        const payload = { ...defaultSend, ...updatedFields };

        if (!Object.keys(updatedFields).length && updateIdData?.id) {
            console.log("No changes made.");
            setLoading(false);
            return;
        }

        try {
            if (updateIdData?.id) {
                await GeneralSettings.update(
                    "banners",
                    payload,
                    updateIdData.id
                );
            } else {
                await GeneralSettings.create("banners", payload);
            }
        } catch (error) {
            console.error("Error creating/updating banner:", error);
        } finally {
            resetForm();
            setUpdateIdData(null);
            closeBannerForm();
            setLoading(false);
        }
    };

    return (
        <div className='space-y-8'>
            <div className='flex justify-between items-center'>
                <h1>Banners</h1>
                <ActionButton onClick={handleCreateBanner}>
                    Add New Banner
                </ActionButton>
            </div>

            {/* Banner Data Table */}
            <div className='mt-8'>
                <BannerData
                    setUpdateIdData={setUpdateIdData}
                    openForm={() => setIsBannerFormOpen(true)}
                />
            </div>

            {/* Banner Form Overlay */}
            {isBannerFormOpen && (
                <Overlay isOpen={isBannerFormOpen} onClose={closeBannerForm}>
                    <div className='space-y-4'>
                        <h1>
                            {updateIdData?.id ? "Update Banner" : "Add Banner"}
                        </h1>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={submitHandler}
                            enableReinitialize={true}
                        >
                            {({ handleSubmit }) => (
                                <Form onSubmit={handleSubmit}>
                                    <div className='space-y-4'>
                                        <Input
                                            name='title'
                                            label='Title'
                                            placeholder='Enter title'
                                            type='text'
                                        />
                                        <Input
                                            name='link'
                                            label='Link'
                                            placeholder='Enter link'
                                            type='text'
                                        />
                                        <Upload
                                            name='file'
                                            label='Upload Banner'
                                            value={
                                                updateIdData?.file &&
                                                updateIdData.file
                                            }
                                        />
                                        <div className='flex justify-end mt-2 gap-2'>
                                            <ActionButton
                                                type='button'
                                                onClick={closeBannerForm}
                                            >
                                                Cancel
                                            </ActionButton>
                                            <ActionButton loading={loading}>
                                                {updateIdData?.id
                                                    ? "Update Banner"
                                                    : "Add Banner"}
                                            </ActionButton>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </Overlay>
            )}
        </div>
    );
};

export default Banner;
