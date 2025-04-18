import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import Button from "@/components/Button";
import SpecificationTable from "@/components/fields/SpecificationTable";
import GeneralSettings from "@/api/generalSettings";
import { useSelector } from "react-redux";

interface ContactFAQsProps {
    type: any;
}

const ContactFAQs: React.FC<ContactFAQsProps> = ({ type }) => {
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        faqs: {},
    });

    const { data: contactFAQs } = useSelector(
        (state: any) => state.contactFAQs || []
    );

    const fetchData = async () => {
        await GeneralSettings.getByGroup("contactFAQs", "contactFAQs");
    };

    useEffect(() => {
        if (!contactFAQs?.length) {
            fetchData();
        }
    }, [contactFAQs?.length]);

    useEffect(() => {
        if (contactFAQs?.length) {
            setInitialValues({
                faqs: contactFAQs[0]?.infos || {},
            });
        }
    }, [contactFAQs]);

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);
        const payload = {
            group: "contactFAQs",
            key: Date.now().toString(),
            value: "contact faqs",
            title: "contact faqs",
            infos: values.faqs,
        };

        try {
            await GeneralSettings.create("contactFAQs", payload);
            resetForm();
        } catch (error: any) {
            console.error("Error adding Contact FAQs:", error);
        }
        setLoading(false);
    };

    return (
        <div>
            <h2 className='text-xl font-bold mb-4'>Contact FAQs</h2>

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
                <p>No FAQs available for Contact section.</p>
            </div>
        </div>
    );
};

export default ContactFAQs;
