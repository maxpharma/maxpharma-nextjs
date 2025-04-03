'use client';

import GeneralSettings from '@/api/generalSettings';
import ActionButton from '@/components/ActionButton';
import Input from '@/components/ui/fields/Input';
import Upload from '@/components/ui/fields/Upload';
import { Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import BannerData from './BannerData';
import { string } from 'yup';

interface BannerType {
    id: number;
    title: string;
    link: string;
    file: string;
}

const Banner = () => {
    const [updateIdData, setUpdateIdData] = useState<BannerType | null>(null);

    const [loading, setLoading] = useState(false);

    const [initialValues, setInitialValues] = useState({
        title: '',
        link: '',
        file: '',
    });

    console.log(initialValues.file, 'initialValues.file');

    useEffect(() => {
        if (updateIdData?.id) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setInitialValues({
                title: updateIdData?.title,
                link: updateIdData?.link,
                file: `${process.env.NEXT_PUBLIC_BUCKET_URL}/${updateIdData?.file}`,
            });
        } else {
            setInitialValues({
                title: '',
                link: '',
                file: '',
            });
        }
    }, [updateIdData?.id, updateIdData]);

    console.log(initialValues, 'initialValues');

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);

        if (typeof values.file === 'string' || !values.file?.base64) {
            console.error('No file uploaded');
            setLoading(false);
            return;
        }

        const payload = {
            group: 'banner',
            key: `banner-${Date.now()}`,
            value: values.link,
            title: values.title,
            file: {
                extension: values.file.extension,
                base64: values.file.base64,
            },
        };

        try {
            if (!!updateIdData?.id) {
                await GeneralSettings.update(
                    'banners',
                    payload,
                    updateIdData?.id
                ).then((res) => console.log(res));
            } else {
                await GeneralSettings.create('banners', payload);
            }
        } catch (error) {
            console.error('Error creating/updating banner:', error);
        } finally {
            resetForm();
            setLoading(false);
        }
    };

    return (
        <div className='space-y-8'>
            <div className='bg-white space-y-4 '>
                <h1>Add New Banner</h1>
                <Formik
                    initialValues={initialValues}
                    onSubmit={submitHandler}
                    enableReinitialize={true}
                >
                    {({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <div className='space-y-4'>
                                <Input
                                    name='title'
                                    label='Title'
                                    placeholder='Enter title'
                                    type='text'
                                />
                                <Input
                                    name='link'
                                    label='Link'
                                    placeholder='Enter link'
                                    type='text'
                                />

                                <Upload
                                    name='file'
                                    label='Upload Banner'
                                    value={
                                        updateIdData?.file
                                            ? `${process.env.NEXT_PUBLIC_BUCKET_URL}/${updateIdData?.file}`
                                            : null
                                    }
                                />

                                <div className='flex justify-end mt-2'>
                                    <ActionButton loading={loading}>
                                        {updateIdData?.id
                                            ? 'Update Banner'
                                            : 'Add Banner'}
                                    </ActionButton>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

            <div className='mt-8'>
                <BannerData setUpdateIdData={setUpdateIdData} />
            </div>
        </div>
    );
};

export default Banner;
