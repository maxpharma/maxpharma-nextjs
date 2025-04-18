import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import Input from "@/components/fields/Input";
import TextArea from "@/components/fields/TextArea";
import Button from "@/components/Button";
import SpecificationTable from "@/components/fields/SpecificationTable";
import GeneralSettings from "@/api/generalSettings";
import { useSelector } from "react-redux";

interface HomeFAQsProps {
    type: any;
}

const HomeFAQs: React.FC<HomeFAQsProps> = ({ type }) => {
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        faqs: {},
    });

    console.log(initialValues, "initialValues");

    const { data: homeFAQs } = useSelector(
        (state: any) => state.homeFAQs || []
    );

    const fetchData = async () => {
        await GeneralSettings.getByGroup("homeFAQs", "homeFAQs");
    };

    useEffect(() => {
        if (!homeFAQs?.length) {
            fetchData();
        }
    }, [homeFAQs?.length]);

    console.log(homeFAQs, "homeFAQs");

    useEffect(() => {
        if (homeFAQs?.length) {
            setInitialValues({
                faqs: homeFAQs[0]?.infos || {},
            });
        }
    }, [homeFAQs]);

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);
        const payload = {
            group: "homeFAQs",
            key: Date.now().toString(),
            value: "home faqs",
            title: "home faqs",
            infos: values.faqs,
        };

        try {
            await GeneralSettings.create("homeFAQs", payload);
            resetForm();
        } catch (error: any) {
            console.error("Error adding Home FAQs:", error);
        }
        setLoading(false);
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
                    <SpecificationTable
                        name='faqs'
                        label='FAQs'
                        valuePlaceholder='Answer'
                        keyPlaceholder='Question'
                    />
                    <Button loading={loading} variant='submit'>
                        Submit
                    </Button>
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
