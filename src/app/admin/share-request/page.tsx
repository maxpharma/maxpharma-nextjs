'use client';

import React, { useState } from 'react';
import ShareRequest from './ShareRequest';
import UploadFiles from './UploadFiles';

const ShareRequestPage = () => {
    const [type, setType] = useState('share-request');

    return (
        <div className='space-y-4'>
            <h1>Add Gallery</h1>
            <div className='flex items-center gap-2'>
                <button
                    onClick={() => setType('share-request')}
                    className={
                        type === 'share-request'
                            ? 'active-button'
                            : 'inactive-button'
                    }
                >
                    Request Share List
                </button>
                <button
                    onClick={() => setType('upload-files')}
                    className={
                        type === 'upload-files'
                            ? 'active-button'
                            : 'inactive-button'
                    }
                >
                    Upload Files
                </button>
            </div>
            <div>
                {type === 'share-request' ? (
                    <ShareRequest />
                ) : (
                    <>
                        <UploadFiles />
                    </>
                )}
            </div>
        </div>
    );
};

export default ShareRequestPage;
