import React, { useState } from "react";
import { Formik, Form } from "formik";
import Input from "@/components/fields/Input";
import TextArea from "@/components/fields/TextArea";
import Button from "@/components/Button";

interface HomeFAQsProps {
    type: string;
}

const HomeFAQs: React.FC<HomeFAQsProps> = ({ type }) => {
    const [initialValues, setInitialValues] = useState({
        question: "",
        answer: "",
    });

    const submitHandler = async (values: any, { resetForm }: any) => {
        console.log({ type, ...values });
        // Here you would add logic to save the FAQ to your backend
        resetForm();
    };

    return (
        <div>
            <h2 className='text-xl font-bold mb-4'>Home FAQs</h2>

            <Formik
                initialValues={initialValues}
                onSubmit={submitHandler}
                enableReinitialize
            >
                <Form className='space-y-4 mb-6'>
                    <Input
                        name='question'
                        label='Question'
                        placeholder='Enter question here'
                        type='text'
                    />
                    <TextArea
                        name='answer'
                        label='Answer'
                        placeholder='Enter answer here'
                    />
                    <Button variant='submit'>Add FAQ</Button>
                </Form>
            </Formik>

            <div className='space-y-4'>
                {/* FAQ items would be displayed here */}
                <p>No FAQs available for Home section.</p>
            </div>
        </div>
    );
};

export default HomeFAQs;
