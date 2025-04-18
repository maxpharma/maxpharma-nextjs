import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import Button from "@/components/Button";
import SpecificationTable from "@/components/fields/SpecificationTable";
import GeneralSettings from "@/api/generalSettings";
import { useSelector } from "react-redux";

interface ProductFAQsProps {
    type: any;
}

const ProductFAQs: React.FC<ProductFAQsProps> = ({ type }) => {
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        faqs: {},
    });

    const { data: productFAQs } = useSelector(
        (state: any) => state.productFAQs || []
    );

    const fetchData = async () => {
        await GeneralSettings.getByGroup("productFAQs", "productFAQs");
    };

    useEffect(() => {
        if (!productFAQs?.length) {
            fetchData();
        }
    }, [productFAQs?.length]);

    useEffect(() => {
        if (productFAQs?.length) {
            setInitialValues({
                faqs: productFAQs[0]?.infos || {},
            });
        }
    }, [productFAQs]);

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);
        const payload = {
            group: "productFAQs",
            key: Date.now().toString(),
            value: "product faqs",
            title: "product faqs",
            infos: values.faqs,
        };

        try {
            await GeneralSettings.create("productFAQs", payload);
            resetForm();
        } catch (error: any) {
            console.error("Error adding Product FAQs:", error);
        }
        setLoading(false);
    };

    return (
        <div>
            <h2 className='text-xl font-bold mb-4'>Product FAQs</h2>

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
                <p>No FAQs available for Product section.</p>
            </div>
        </div>
    );
};

export default ProductFAQs;
