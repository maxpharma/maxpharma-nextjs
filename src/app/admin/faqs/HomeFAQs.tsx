import GeneralSettings from "@/api/generalSettings";
import Button from "@/components/Button";
import SpecificationTable from "@/components/fields/SpecificationTable";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface HomeFAQsProps {
    type: any;
}

const HomeFAQs: React.FC<HomeFAQsProps> = ({ type }) => {
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        faqs: {},
    });
    const [faqId, setFaqId] = useState<number | null>(null);
    const [faqKey, setFaqKey] = useState<string | null>(null);

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

    useEffect(() => {
        if (homeFAQs?.length) {
            setInitialValues({
                faqs: homeFAQs[0]?.infos || {},
            });
            setFaqId(homeFAQs[0]?.id || null);
            setFaqKey(homeFAQs[0]?.key || null);
        }
    }, [homeFAQs]);

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);
        const payload = {
            key: faqKey || Date.now().toString(),
            value: "home faqs",
            infos: values.faqs,
        };

        try {
            if (faqId) {
                // Update existing FAQ
                await GeneralSettings.update("homeFAQs", payload, faqId);
            } else {
                // Create new FAQ
                await GeneralSettings.create("homeFAQs", {
                    ...payload,
                    group: "homeFAQs",
                    title: "home faqs",
                });
            }
            resetForm();
        } catch (error: any) {
            console.error("Error updating Home FAQs:", error);
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
                        {faqId ? "Update FAQs" : "Add FAQs"}
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
