'use client';

import Documents from '@/api/documents';
import ActionButton from '@/components/ActionButton';
import Dropdown from '@/components/ui/Dropdown';
import Input from '@/components/ui/fields/Input';
import Upload from '@/components/ui/fields/Upload';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import DocumentsData from './DocumentsData';
import NepaliDatePicker from '@/components/ui/fields/NepaliDatePicker';

interface DocumentType {
    id: number;
    title: string;
    type: string;
    date: string;
    file: string;
}

const DocumentsPage = () => {
    const [updateIdData, setUpdateIdData] = useState<DocumentType | null>(null);
    const [dropdownValue, setDropdownValue] = useState('');
    console.log(dropdownValue, 'dropdownValue');
    const [loading, setLoading] = useState(false);

    const documentOptions = [
        'Notice Board',
        'Company News',
        'Press & Media Release',
        'Procurement Notices',
        'Career News',
        'Downloads',
    ];

    const handleDocumentTypeChange = (selectedOption: string) => {
        setDropdownValue(selectedOption);
    };
    const [initialValues, setInitialValues] = useState({
        title: '',
        type: '',
        date: '',
        file: {
            base64: '',
            extension: '',
        },
    });

    useEffect(() => {
        if (updateIdData?.id) {
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
            setInitialValues({
                title: updateIdData?.title,
                type: updateIdData?.type,
                date: updateIdData?.date,
                file: {
                    base64: `${process.env.NEXT_PUBLIC_BUCKET_URL}/${updateIdData?.file}`,
                    extension: updateIdData?.file.split('.').pop() || '',
                },
            });
            setDropdownValue(updateIdData?.type);
        } else {
            setInitialValues({
                title: '',
                type: '',
                date: '',
                file: {
                    base64: '',
                    extension: '',
                },
            });
            setDropdownValue('');
        }
    }, [
        updateIdData?.id,
        updateIdData?.file,
        updateIdData,
        updateIdData?.type,
    ]);

    console.log(initialValues, 'initialValues');

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);

        const payload = {
            title: values.title,
            type: dropdownValue,
            date: values.date,
            file: {
                base64: values.file.base64,
                extension: values.file.extension,
            },
        };

        try {
            if (updateIdData?.id) {
                await Documents.update('documents', payload, updateIdData?.id);
            } else {
                await Documents.create('documents', payload);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            resetForm();
            setUpdateIdData(null);
            setLoading(false);
        }
    };

    return (
        <>
            <div className='space-y-6'>
                <Formik
                    initialValues={initialValues}
                    onSubmit={submitHandler}
                    enableReinitialize={true}
                >
                    {({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <div className='flex gap-4'>
                                <Dropdown
                                    label='Document Type'
                                    options={documentOptions}
                                    placeholder='Select Document Type'
                                    onChange={handleDocumentTypeChange}
                                    className='w-1/2'
                                    value={dropdownValue}
                                />
                                <Input
                                    name='title'
                                    label='Title'
                                    placeholder='Enter title'
                                    className='w-1/2'
                                />
                            </div>
                            <div className='flex gap-4'>
                                <NepaliDatePicker
                                    name='date'
                                    label='Date'
                                    placeholder='Select Date'
                                    className='w-1/2'
                                />
                                <Upload
                                    variant='input'
                                    name='file'
                                    label='Upload File'
                                    placeholder='Upload File'
                                    acceptFiles={true}
                                    className='w-1/2'
                                    value={
                                        updateIdData?.file
                                            ? `${process.env.NEXT_PUBLIC_BUCKET_URL}/${updateIdData?.file}`
                                            : null
                                    }
                                />
                            </div>
                            <ActionButton
                                loading={loading}
                                type='submit'
                                classname='flex justify-self-end'
                            >
                                {updateIdData?.id ? 'Update' : 'Save'}
                            </ActionButton>
                        </Form>
                    )}
                </Formik>
                <DocumentsData setUpdateIdData={setUpdateIdData} />
            </div>
        </>
    );
};

export default DocumentsPage;
