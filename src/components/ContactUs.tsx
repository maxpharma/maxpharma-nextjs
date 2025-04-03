import React from 'react';
import Input from './ui/fields/Input';
import { Form, Formik } from 'formik';
import PhoneInput from './ui/fields/Phone';
import TextArea from './ui/fields/TextArea';
import Image from 'next/image';

const ContactUs = () => {
    return (
        <div className='flex max-md:flex-col items-center justify-between  gap-4 p-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <h2>Contact Us Today</h2>
                <p>
                    We really appreciate you taking the time to get in touch.
                    Please fill in the form below.
                </p>
                <div className='relative h-50 w-50 md:hidden mx-auto'>
                    <Image
                        src={'/svg/contact-image.svg'}
                        alt='Contact Us'
                        fill
                        className='object-cover'
                    />
                </div>
                <Formik
                    initialValues={{ name: '', email: '', message: '' }}
                    onSubmit={(values) => {
                        console.log(values);
                    }}
                >
                    {({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <div className='flex md:gap-4 max-md:flex-col w-full'>
                                <div className='flex-1'>
                                    <Input
                                        name='name'
                                        label='Name'
                                        placeholder='Enter your name'
                                        required
                                    />
                                </div>
                                <div className='flex-1'>
                                    <PhoneInput
                                        name='phone'
                                        label='Phone'
                                        placeholder='Enter your phone number'
                                        required
                                    />
                                </div>
                            </div>
                            <TextArea
                                name='message'
                                label='Message'
                                placeholder='Enter your message'
                                required
                            />
                            <button type='submit' className='button'>
                                Send Message
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
            <div className='relative h-50 w-50 md:size-100 max-md:hidden'>
                <Image
                    src={'/svg/contact-image.svg'}
                    alt='Contact Us'
                    fill
                    className='object-cover'
                />
            </div>
        </div>
    );
};

export default ContactUs;
