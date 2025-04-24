import Inquiry from "@/api/Inquiry";
import Products from "@/api/product";
import Button from "@/components/Button";
import Dropdown from "@/components/fields/Dropdown";
import Input from "@/components/fields/Input";
import PhoneInput from "@/components/fields/Phone";
import TextArea from "@/components/fields/TextArea";
import SuccessModal from "@/components/ui/SuccessModal";
import { Form, Formik } from "formik";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface SendInquiryProps {
    varient?: "extra";
    onSuccess?: () => void; // <-- Add this line
}

const SendInquiry = ({ varient, onSuccess }: SendInquiryProps) => {
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Fix: Only set timeout when modal is shown
    useEffect(() => {
        if (showSuccessModal) {
            const timer = setTimeout(() => {
                setShowSuccessModal(false);
            }, 2000); // match autoDisappearTime
            return () => clearTimeout(timer);
        }
    }, [showSuccessModal]);

    const pathname = usePathname();

    const productId = pathname.split("/").pop() || null;

    const { items: ProductsData } = useSelector((state: any) => state.products);

    const fetchData = async () => {
        await Products.get();
    };

    useEffect(() => {
        fetchData();
    }, [productId]);

    const initialValues = {
        name: "",
        phone: "",
        email: "",
        location: "",
        message: "",
        product: varient === "extra" ? "" : undefined,
    };

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);
        const payload = {
            name: values?.name,
            phone: values?.phone,
            email: values?.email,
            location: values?.location,
            productId:
                varient === "extra"
                    ? ProductsData?.find(
                          (item: any) => item.name === values?.product
                      )?.id
                    : productId,
            message: values?.message,
        };
        try {
            await Inquiry.create(payload);
            resetForm();
            if (onSuccess) onSuccess();
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Error submitting inquiry:", error);
        }
        setLoading(false);
    };

    return (
        <>
            {showSuccessModal && (
                <SuccessModal
                    message="Your inquiry has been sent successfully! We'll get back to you soon."
                    autoDisappear={true}
                    autoDisappearTime={2000}
                />
            )}
            <div className='space-y-4 '>
                <h1>Interested in Our Products</h1>
                <Formik initialValues={initialValues} onSubmit={submitHandler}>
                    <Form>
                        <div className='flex gap-4 flex-col sm:flex-row'>
                            <Input
                                name='name'
                                label='Name'
                                placeholder='Enter your name'
                                required
                                className='flex-1'
                            />
                            <PhoneInput
                                name='phone'
                                label='Contact Number'
                                placeholder='Phone Number'
                                required
                                className='flex-1'
                            />
                        </div>
                        <div className='flex gap-4 flex-col sm:flex-row'>
                            <Input
                                name='email'
                                label='Email'
                                placeholder='Enter your email'
                                type='email'
                                required
                                className='flex-1'
                            />
                            <Input
                                name='location'
                                label='Location'
                                placeholder='Enter your Location'
                                required
                                className='flex-1'
                            />
                        </div>
                        {varient === "extra" && (
                            <Dropdown
                                name='product' // <-- Add this line
                                options={ProductsData?.map(
                                    (item: any) => item.name
                                )}
                                label='Select Product'
                                placeholder='Select Product'
                                className='mb-4'
                            />
                        )}
                        <TextArea
                            name='message'
                            label='Message'
                            placeholder='Enter your message'
                            required
                        />
                        <Button loading={loading} variant='submit'>
                            Send Message
                        </Button>
                    </Form>
                </Formik>
            </div>
        </>
    );
};

export default SendInquiry;
