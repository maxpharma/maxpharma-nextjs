'use client';

import Gallery from '@/api/gallery';
import ActionButton from '@/components/ActionButton';
import Input from '@/components/ui/fields/Input';
import Upload from '@/components/ui/fields/Upload';
import { Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import ImageData from './ImageData';

interface FileData {
    extension: string;
    base64: string;
    fileName?: string;
    info?: string;
    type?: string;
    size?: number;
}

interface ImageFormValues {
    title: string;
    file: FileData[];
}

const ImageSection = () => {
    const [loading, setLoading] = useState(false);

    const [initialValues, setInitialValues] = useState<ImageFormValues>({
        title: '',
        file: [],
    });

    console.log(initialValues, 'initialValues');

    const submitHandler = async (
        values: ImageFormValues,
        { resetForm }: FormikHelpers<ImageFormValues>
    ) => {
        setLoading(true);

        if (!values.file || values.file.length === 0) {
            console.error('No files uploaded');
            setLoading(false);
            return;
        }

        const payload = {
            title: values.title,
            file: values.file.map((file) => ({
                extension: file.extension,
                base64: file.base64,
            })),
        };

        try {
            await Gallery.uploadImage('gallery', payload);
        } catch (error) {
            console.error('Error uploading images:', error);
        } finally {
            setLoading(false);
            resetForm();
            window.location.reload();
        }
    };

    return (
        <div className='bg-white py-6 rounded-lg space-y-4'>
            <h1>Upload Gallery Images</h1>
            <Formik
                initialValues={initialValues}
                onSubmit={submitHandler}
                enableReinitialize={true}
            >
                {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit} className='space-y-4'>
                        <Input
                            name='title'
                            label='Title'
                            placeholder='Enter title'
                            type='text'
                        />

                        <Upload
                            name='file'
                            label='Upload Images'
                            variant='multiple'
                        />

                        <div className='flex justify-end mt-6'>
                            <ActionButton type='submit' loading={loading}>
                                Upload
                            </ActionButton>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ImageSection;
