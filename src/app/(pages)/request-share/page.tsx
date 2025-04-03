'use client';

import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/fields/Input';
import PhoneInput from '@/components/ui/fields/Phone';
import Upload from '@/components/ui/fields/Upload';
import { Form, Formik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Applications from '@/api/applications';
import ActionButton from '@/components/ActionButton';
import CustomToast from '@/components/CustomToast';
import validation from '@/utils/validation';
import GeneralSettings from '@/api/generalSettings';
import { useSelector } from 'react-redux';

const RequestShare = () => {
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const initialValues = {
        name: '',
        phone: '',
        citizenship: null,
        voucher: null,
        application: null,
    };

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);

        const payload = {
            name: values.name,
            phone: values.phone,
            citizenship: {
                base64: values.citizenship.base64,
                extension: values.citizenship.extension,
            },
            bankDeposit: {
                base64: values.voucher.base64,
                extension: values.voucher.extension,
            },
            requestForm: {
                base64: values.application.base64,
                extension: values.application.extension,
            },
        };

        await Applications.create('applications', payload)
            .then(() => {
                resetForm();
                setShowToast(true);
            })
            .catch(() => {})
            .finally(() => {
                setLoading(false);
            });
    };

    const { data: filesData } = useSelector(
        (state: any) => state.shareUploadedFiles || []
    );

    const fetchData = async () => {
        await GeneralSettings.getByGroup('shareUploadedFiles', 'shares', '');
    };

    useEffect(() => {
        if (!filesData.length) {
            fetchData();
        }
    }, [filesData.length]);

    const customOrder = [
        'right-share',
        'institutional-share',
        'individual-share',
    ];

    const sortedData = [...filesData].sort((a: any, b: any) => {
        return customOrder.indexOf(a.value) - customOrder.indexOf(b.value);
    });

    return (
        <>
            <div className='relative w-[96vw] mx-auto bg-blue-50 py-6 md:py-12 rounded-lg flex flex-col items-center space-y-4 '>
                <h1>Request of Share Invest Application</h1>
                <p className='text-center'>
                    Download the Share Form and Fill It Properly & Upload with
                    Name and Mobile Number to Us
                </p>

                <div className='absolute -bottom-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-16 max-md:hidden'>
                    {sortedData.map((form: any) => (
                        <div
                            key={form.id}
                            className=' relative bg-light-green rounded-lg py-6 pl-6 pr-18 border border-green-100 shadow-sm'
                        >
                            <h3 className='text-lg font-medium text-gray-800 mb-2'>
                                {(() => {
                                    switch (form?.value) {
                                        case 'right-share':
                                            return 'Right Share Form';
                                        case 'institutional-share':
                                            return 'Institutional Share Form';
                                        case 'individual-share':
                                            return 'Individual Share Form';
                                        default:
                                            return form?.value;
                                    }
                                })()}
                            </h3>

                            <div className='flex justify-center absolute right-2 -bottom-6'>
                                <Button
                                    onClick={() => {
                                        window.open(
                                            `${process.env.NEXT_PUBLIC_BUCKET_URL}/${form?.file}`,
                                            '_blank'
                                        );
                                    }}
                                >
                                    Download Now{' '}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className=' grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-16 md:hidden'>
                    {sortedData.map((form: any) => (
                        <div
                            key={form.id}
                            className=' space-y-4 bg-light-green rounded-lg py-4 px-12 border border-green-100 shadow-sm'
                        >
                            <h3 className='text-lg font-medium text-gray-800 '>
                                {(() => {
                                    switch (form?.value) {
                                        case 'right-share':
                                            return 'Right Share Form';
                                        case 'institutional-share':
                                            return 'Institutional Share Form';
                                        case 'individual-share':
                                            return 'Individual Share Form';
                                        default:
                                            return form?.value;
                                    }
                                })()}
                            </h3>

                            <div className='flex justify-center  '>
                                <Button
                                    onClick={() => {
                                        window.open(
                                            `${process.env.NEXT_PUBLIC_BUCKET_URL}/${form?.file}`,
                                            '_blank'
                                        );
                                    }}
                                >
                                    Download Now{' '}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='custom-container flex max-md:flex-col-reverse gap-12 mt-12 md:mt-40'>
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
                    <h1>Fill the Details & Upload Share Request Application Here</h1>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={submitHandler}
                        validationSchema={validation.shareRequestSchema}
                    >
                        {({ handleSubmit, values }) => {
                            console.log(values);
                            return (
                                <Form onSubmit={handleSubmit}>
                                    <div className='flex max-md:flex-col md:gap-4'>
                                        <Input
                                            type='text'
                                            label='Name'
                                            name='name'
                                            placeholder='Name'
                                            className='flex-1'
                                        />
                                        <PhoneInput
                                            name='phone'
                                            placeholder='Phone'
                                            className='flex-1'
                                        />
                                    </div>

                                    <Upload
                                        name='citizenship'
                                        label='Upload Citizenship with Signature'
                                        acceptFiles={true}
                                        className='flex-1'
                                    />
                                    <Upload
                                        label='Upload Bank Deposit Voucher'
                                        name='voucher'
                                        acceptFiles={true}
                                        className='flex-1'
                                    />
                                    <Upload
                                        label='Upload Filled Share Request Application Form'
                                        name='application'
                                        acceptFiles={true}
                                        className='flex-1'
                                    />

                                    <ActionButton
                                        type='submit'
                                        loading={loading}
                                    >
                                        Apply Share
                                    </ActionButton>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
            {showToast && (
                <CustomToast
                    title='Congratulations!'
                    message='Share Applied Successfully'
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

export default RequestShare;
