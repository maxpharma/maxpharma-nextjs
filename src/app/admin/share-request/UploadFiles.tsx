import GeneralSettings from '@/api/generalSettings';
import ActionButton from '@/components/ActionButton';
import Upload from '@/components/ui/fields/Upload';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import UploadedFilesData from './UploadedFilesData';

const UploadFiles = () => {
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('right-share');

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);

        if (!values.file || !values.file.base64) {
            console.error('No file uploaded');
            setLoading(false);
            return;
        }

        const payload = {
            group: 'shares',
            key: `share-${Date.now()}`,
            value: type,
            file: {
                extension: values.file.extension,
                base64: values.file.base64,
            },
        };

        await GeneralSettings.create('shareUploadedFiles', payload);

        setLoading(false);
        resetForm();
    };

    return (
        <div className='space-y-4 my-12'>
            <div className='flex gap-4'>
                <button
                    className={
                        type === 'right-share'
                            ? 'active-button'
                            : 'inactive-button'
                    }
                    onClick={() => setType('right-share')}
                >
                    Right Share
                </button>
                <button
                    className={
                        type === 'institutional-share'
                            ? 'active-button'
                            : 'inactive-button'
                    }
                    onClick={() => setType('institutional-share')}
                >
                    Share Request
                </button>
                <button
                    className={
                        type === 'individual-share'
                            ? 'active-button'
                            : 'inactive-button'
                    }
                    onClick={() => setType('individual-share')}
                >
                    Share Request
                </button>
            </div>
            <Formik
                initialValues={{ file: { base64: '', extension: '' } }}
                onSubmit={submitHandler}
            >
                {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Upload
                            name='file'
                            label='Upload File'
                            variant='dashed'
                            acceptFiles={true}
                        />
                        <ActionButton type='submit' loading={loading}>
                            Upload
                        </ActionButton>
                    </Form>
                )}
            </Formik>
            <UploadedFilesData />
        </div>
    );
};

export default UploadFiles;
