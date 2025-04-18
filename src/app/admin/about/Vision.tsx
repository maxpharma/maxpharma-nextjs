import AboutUs from "@/api/aboutUs";
import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import TextArea from "@/components/fields/TextArea";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Vision = ({ type }: { type: string }) => {
    const [loading, setLoading] = useState(false);
    const { items: ourVision } = useSelector(
        (state: any) => state.aboutUsOurVision
    );

    const fetchData = async () => {
        await AboutUs.get("aboutUsOurVision", type);
    };

    useEffect(() => {
        if (!ourVision?.length) {
            fetchData();
        }
    }, [ourVision?.length, type]);

    console.log(ourVision, "ourVision");

    const [initialValues, setInitialValues] = useState({
        title: "",
        description: "",
        ourMission: "",
        goal: "",
    });

    useEffect(() => {
        if (ourVision?.length) {
            setInitialValues({
                title: ourVision[0]?.title || "",
                description: ourVision[0]?.description || "",
                ourMission: ourVision[0]?.infos?.ourMission || "",
                goal: ourVision[0]?.infos?.goal || "",
            });
        }
    }, [ourVision]);

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);

        const isUpdate = ourVision?.length > 0 && ourVision[0]?.id;
        const original = ourVision?.[0] || {};

        const defaultSend = {
            title: values.title,
            type: "Our Vision",
            description: values.description,
        };

        const getUpdatedFields = () => {
            if (!isUpdate) {
                return {
                    infos: {
                        ourMission: values.ourMission,
                        goal: values.goal,
                    },
                };
            }
            const changed: any = {};
            if (values.description !== original.description)
                changed.description = values.description;
            if (
                values.ourMission !== original.infos?.ourMission ||
                values.goal !== original.infos?.goal
            ) {
                changed.infos = {
                    ourMission: values.ourMission,
                    goal: values.goal,
                };
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
                await AboutUs.update("aboutUsOurVision", original.id, payload);
            } else {
                await AboutUs.create("aboutUsOurVision", payload);
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
                    <Input
                        name='ourMission'
                        label='Our Mission'
                        placeholder='Enter our mission here'
                        type='text'
                    />
                    <Input
                        name='goal'
                        label='Goal'
                        placeholder='Enter goal here'
                        type='text'
                    />
                    <Button variant='submit' loading={loading}>
                        Submit
                    </Button>
                </Form>
            </Formik>
        </div>
    );
};

export default Vision;
