'use client';

import { useState } from 'react';
import ImageSection from './ImageSection';
import VideoSection from './VideoSection';
import ImageData from './ImageData';
import VideoData from './VideoData';
import ImageUpdateOverlay from './ImageUpdateOverlay';

interface UpdateIdData {
    id: number;
    title: string;
    gallery: any[];
}

const Gallery = () => {
    const [type, setType] = useState<'image' | 'video'>('image');
    const [updateIdData, setUpdateIdData] = useState<UpdateIdData | null>(null);

    const closeOverlay = () => setUpdateIdData(null);

    return (
        <div>
            <h1 className='text-2xl font-bold mb-4'>Add Gallery</h1>

            <div className='flex items-center gap-2 mb-6'>
                <button
                    onClick={() => setType('image')}
                    className={`px-4 py-2 rounded ${
                        type === 'image' ? 'active-button' : 'inactive-button'
                    }`}
                >
                    Image
                </button>
                <button
                    onClick={() => setType('video')}
                    className={`px-4 py-2 rounded ${
                        type === 'video' ? 'active-button' : 'inactive-button'
                    }`}
                >
                    Video
                </button>
            </div>

            {type === 'image' ? (
                <>
                    <ImageSection />
                    <ImageData setUpdateIdData={setUpdateIdData} />
                </>
            ) : (
                <VideoSection />
            )}

            {/* Overlay appears when updateIdData is truthy */}
            {updateIdData && (
                <ImageUpdateOverlay
                    updateIdData={updateIdData}
                    closeOverlay={closeOverlay}
                />
            )}
        </div>
    );
};

export default Gallery;
