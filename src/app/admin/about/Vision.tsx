"use client";

import AboutUs from "@/api/aboutUs";
import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import MyEditor from "@/components/fields/MyEditor";
import TextArea from "@/components/fields/TextArea";
import CustomToast from "@/components/CustomToast";
import { Form, Formik } from "formik";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

const parseInfos = (infos: any) => {
    if (!infos) return { ourMission: "", goal: "" };
    if (typeof infos === "string") {
        try {
            return JSON.parse(infos);
        } catch {
            return { ourMission: "", goal: "" };
        }
    }
    return infos;
};

const Vision = ({ type }: { type: string }) => {
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const { items: ourVision } = useSelector(
        (state: any) => state.aboutUsOurVision || {}
    );

    const fetchData = useCallback(async () => {
        try {
            await AboutUs.get("aboutUsOurVision", type);
        } catch (error) {
            console.error("Error fetching vision data:", error);
        }
    }, [type]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const [initialValues, setInitialValues] = useState({
        id: "",
        title: "",
        description: "",
        ourMission: "",
        goal: "",
    });

    useEffect(() => {
        if (ourVision?.length) {
            const item = ourVision[0];
            const parsedInfos = parseInfos(item?.infos);
            setInitialValues({
                id: item?.id ? String(item.id) : "",
                title: item?.title || "",
                description: item?.description || "",
                ourMission: parsedInfos?.ourMission || "",
                goal: parsedInfos?.goal || "",
            });
        }
    }, [ourVision]);

    const submitHandler = async (values: any) => {
        setLoading(true);

        const currentItem = ourVision?.[0];
        const isUpdate = Boolean(currentItem?.id);

        const payload = {
            title: values.title,
            type: "Our Vision",
            description: values.description,
            infos: {
                ourMission: values.ourMission,
                goal: values.goal,
            },
        };

        try {
            if (isUpdate) {
                await AboutUs.update("aboutUsOurVision", currentItem.id, payload);
                setToastMessage("Vision updated successfully");
            } else {
                await AboutUs.create("aboutUsOurVision", payload);
                setToastMessage("Vision created successfully");
            }
            setShowToast(true);
            await fetchData();
        } catch (error: any) {
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
                    <Input
                        name='title'
                        label='Title'
                        placeholder='Enter title here'
                        type='text'
                    />
                    <TextArea
                        name='description'
                        label='Description'
                        placeholder='Enter description here'
                    />
                    <MyEditor
                        name='ourMission'
                        label='Our Mission'
                        placeholder='Enter our mission here'
                    />
                    <MyEditor
                        name='goal'
                        label='Goal'
                        placeholder='Enter goal here'
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

export default Vision;
