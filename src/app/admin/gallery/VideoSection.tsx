'use client';

import GeneralSettings from '@/api/generalSettings';
import ActionButton from '@/components/ActionButton';
import Input from '@/components/ui/fields/Input';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import VideoData from './VideoData';

interface VideoType {
    id: number;
    title: string;
    link: string;
}

const VideoSection = () => {
    const [updateIdData, setUpdateIdData] = useState<VideoType | null>(null);
    console.log(updateIdData, 'updateIdData');
    const [loading, setLoading] = useState(false);

    const [initialValues, setInitialValues] = useState({
        title: '',
        link: '',
    });

    useEffect(() => {
        if (updateIdData?.id) {
            setInitialValues({
                title: updateIdData?.title,
                link: updateIdData?.link,
            });
        } else {
            setInitialValues({
                title: '',
                link: '',
            });
        }
    }, [updateIdData?.id, updateIdData]);

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);

        const payload = {
            group: 'video',
            key: `video-${Date.now()}`,
            value: values.link,
            title: values.title,
        };

        try {
            if (!!updateIdData?.id) {
                await GeneralSettings.update(
                    'videos',
                    payload,
                    updateIdData?.id
                );
            } else {
                await GeneralSettings.create('videos', payload);
            }
        } catch (error) {
            console.error('Error uploading video:', error);
        } finally {
            setLoading(false);
            setUpdateIdData(null);
        }
    };

    return (
        <div className='space-y-8'>
            <Formik
                initialValues={initialValues}
                onSubmit={submitHandler}
                enableReinitialize={true}
            >
                {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
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
                        <ActionButton
                            loading={loading}
                            type='submit'
                            classname='flex justify-self-end'
                        >
                            {updateIdData?.id ? 'Update' : 'Add New Video'}
                        </ActionButton>
                    </Form>
                )}
            </Formik>
            <VideoData setUpdateIdData={setUpdateIdData} />
        </div>
    );
};

export default VideoSection;
