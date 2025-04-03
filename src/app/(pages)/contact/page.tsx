'use client';

import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';

import Contact from '@/api/contacts';
import ActionButton from '@/components/ActionButton';
import CustomToast from '@/components/CustomToast';
import Input from '@/components/ui/fields/Input';
import PhoneInput from '@/components/ui/fields/Phone';
import TextArea from '@/components/ui/fields/TextArea';
import validation from '@/utils/validation';
import { Form, Formik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const ContactPage = () => {
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const initialValues = {
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
    };

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);
        console.log(values);

        const payload = {
            name: values.name,
            phone: values.phone,
            email: values.email,
            subject: values.subject,
            message: values.message,
        };

        await Contact.create('contacts', payload).then(() => {
            setShowToast(true);
            resetForm();
        });

        setLoading(false);
    };

    return (
        <>
            <div className='bg-light-blue py-20 w-[96vw] flex justify-center items-center mx-auto rounded-lg'>
                <h1>Contact Us</h1>
            </div>
            <div className='custom-container flex  gap-12 mt-8 md:20 max-md:flex-col-reverse'>
                <div className='flex flex-col gap-4 px-2 py-4 bg-light-green space-y-4 rounded-lg'>
                    <h1>Get In Touch</h1>
                    <p>
                        We really appreciate you taking the time to get in
                        touch. Please fill in the form below.
                    </p>
                    <h1>Contact</h1>
                    <div className='flex max-md:flex-col gap-4'>
                        <div className='flex gap-2 items-center text-primary'>
                            <Phone />
                            <p>01-5913729 | 5913728</p>
                        </div>
                        <div className='flex gap-2 items-center text-primary'>
                            <Mail />

                            <p>Contact@prabhusteel.com</p>
                        </div>
                    </div>
                    <div className='flex gap-2 items-center text-primary'>
                        <MapPin />
                        <p>Kathmandu-32 Tinkune, Near to NMB Bank</p>
                    </div>
                    <div className='flex gap-2 items-center text-primary'>
                        <Clock />
                        <p>Opening Hours: Sun- Fri 10:00am to 6:00pm</p>
                    </div>

                    <div className='flex gap-4 items-center'>
                        <Link
                            href='https://www.facebook.com'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <Image
                                src={'/svg/facebook.svg'}
                                alt='facebook logo'
                                width={32}
                                height={32}
                            />
                        </Link>
                        <Link
                            href='https://www.instagram.com'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <Image
                                src={'/svg/instagram.svg'}
                                alt='instagram logo'
                                width={32}
                                height={32}
                            />
                        </Link>
                        <Link
                            href='https://www.youtube.com'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <Image
                                src={'/svg/youtube.svg'}
                                alt='youtube logo'
                                width={32}
                                height={32}
                            />
                        </Link>
                        <Link
                            href='https://twitter.com'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <FaXTwitter size={28} />
                        </Link>
                    </div>
                </div>
                <div className='px-2 py-4 md:px-4 md:py-8 bg-light-blue space-y-4 rounded-lg flex-1'>
                    <h1>Leave Your Message</h1>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={submitHandler}
                        validationSchema={validation.contactFormSchema}
                    >
                        {({ handleChange, handleSubmit }) => (
                            <Form onSubmit={handleSubmit}>
                                <div className='flex max-md:flex-col md:gap-4'>
                                    <Input
                                        type='text'
                                        label='Name'
                                        name='name'
                                        placeholder='Name'
                                        onChange={handleChange}
                                        className='flex-1'
                                    />
                                    <PhoneInput
                                        name='phone'
                                        placeholder='Phone'
                                        onChange={handleChange}
                                        className='flex-1'
                                    />
                                </div>

                                <div className='flex max-md:flex-col md:gap-4'>
                                    <Input
                                        type='email'
                                        label='Email'
                                        name='email'
                                        placeholder='Email'
                                        onChange={handleChange}
                                        className='flex-1'
                                    />
                                    <Input
                                        type='text'
                                        label='Subject'
                                        name='subject'
                                        placeholder='Subject'
                                        onChange={handleChange}
                                        className='flex-1'
                                    />
                                </div>

                                <TextArea
                                    name='message'
                                    label='Message'
                                    placeholder='Message'
                                    onChange={handleChange}
                                />
                                <ActionButton type='submit' loading={loading}>
                                    Send Message
                                </ActionButton>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            <div className='flex justify-center items-center p-4'>
                <iframe
                    src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.018990972074!2d85.34028958072459!3d27.685807914815122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x20ec6332010a6a87%3A0xf12335ef61156c6e!2sPrabhu%20Steels%20%26%20Hydro%20Investment%20Company%20Limited!5e0!3m2!1sen!2snp!4v1741518663704!5m2!1sen!2snp'
                    width='100%'
                    height='450'
                    style={{ border: 0 }}
                    allowFullScreen
                    loading='lazy'
                    referrerPolicy='no-referrer-when-downgrade'
                ></iframe>
            </div>
            {showToast && (
                <CustomToast
                    title='Message Sent!'
                    message='Your message has been submitted successfully.'
                    buttonText='Close'
                    labelText='We will get back to you soon.'
                    onButtonClick={() => {
                        setShowToast(false);
                    }}
                    onClose={() => setShowToast(false)}
                />
            )}
        </>
    );
};

export default ContactPage;
