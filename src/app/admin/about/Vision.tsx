import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import TextArea from "@/components/fields/TextArea";
import Upload from "@/components/fields/Upload";
import { Form, Formik } from "formik";
import React, { useState } from "react";

const Vision = ({ type }: any) => {
    const [initialValues, setInitialValues] = useState({
        title: "",
        ourMission: "",
        goal: "",
    });

    const submitHandler = async (values: any, { resetForm }: any) => {
        console.log(values);
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
