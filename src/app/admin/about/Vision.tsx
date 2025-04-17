import AboutUs from "@/api/aboutUs";
import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import TextArea from "@/components/fields/TextArea";
import Upload from "@/components/fields/Upload";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Vision = ({ type }: { type: string }) => {
    const [loading, setLoading] = useState(false);
    const { data: aboutUsData } = useSelector((state: any) => state.aboutUs);

    console.log(type, "type");

    const fetchData = async () => {
        await AboutUs.get("Our Vision");
    };

    useEffect(() => {
        fetchData();
    }, []);

    console.log(aboutUsData, "aboutUsData");

    const [initialValues, setInitialValues] = useState({
        title: "",
        ourMission: "",
        goal: "",
    });

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);

        const payload = {
            title: values.title,
            description: values.ourMission,
            goal: values.goal,
        };

        resetForm();
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

                    <Button variant='submit'>Submit</Button>
                </Form>
            </Formik>
        </div>
    );
};

export default Vision;
