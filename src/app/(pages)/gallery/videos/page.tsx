'use client';

import GeneralSettings from '@/api/generalSettings';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const VideoPage = () => {
    const { data: videos } = useSelector(
        (state: any) => state.videos || { data: [] }
    );

    const fetchData = async () => {
        await GeneralSettings.getByGroup('videos', 'video', '');
    };

    useEffect(() => {
        if (!videos?.length) {
            fetchData();
        }
    }, [videos?.length]);

    // Function to extract video ID from YouTube URL
    const getYoutubeVideoId = (url: any) => {
        if (!url) return null;

        // Handle different YouTube URL formats
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        return match && match[2].length === 11 ? match[2] : null;
    };

    // Function to create YouTube embed URL
    const getEmbedUrl = (videoId: any) => {
        return `https://www.youtube.com/embed/${videoId}`;
    };

    // Filter out invalid URLs
    const validVideos =
        videos?.filter((video: any) => getYoutubeVideoId(video.value)) || [];

    return (
        <div className='container mx-auto py-8 px-4'>
            <div className='text-center mb-8'>
                <h1 className='text-3xl font-bold mb-2'>
                    Watch Our Videos on Youtube
                </h1>
                <div className='w-24 h-1 bg-primary mx-auto'></div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6'>
                {validVideos.map((video: any) => {
                    const videoId = getYoutubeVideoId(video.value);
                    if (!videoId) return null;

                    return (
                        <div
                            key={video.id}
                            className='relative overflow-hidden rounded-lg shadow-lg'
                        >
                            <a
                                href={video.value}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='block'
                            >
                                <div className='w-full h-72 md:h-100'>
                                    <iframe
                                        className='w-full h-full'
                                        src={getEmbedUrl(videoId)}
                                        title='YouTube video player'
                                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                        allowFullScreen
                                        loading='lazy'
                                    ></iframe>
                                </div>
                            </a>
                        </div>
                    );
                })}
            </div>

            {validVideos.length === 0 && (
                <div className='text-center py-12'>
                    <p className='text-gray-500'>
                        No videos available at the moment.
                    </p>
                </div>
            )}
        </div>
    );
};

export default VideoPage;
