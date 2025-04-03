'use client';

import Documents from '@/api/documents';
import Button from '@/components/Button';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';

const DocumentsPage = () => {
    const [selectedType, setSelectedType] = useState('All');
    const [showImageOverlay, setShowImageOverlay] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const documentsData = useSelector(
        (state: any) => state.documents?.items || []
    );

    const fetchData = async () => {
        await Documents.getData('documents');
    };

    useEffect(() => {
        if (!documentsData.length) {
            fetchData();
        }
    }, [documentsData.length]);

    const uniqueTypes = Array.from(
        new Set(documentsData.map((item: any) => item.type))
    );

    const filteredItems =
        selectedType !== 'All'
            ? documentsData.filter((item: any) => item.type === selectedType)
            : documentsData;

    const groupedByType: Record<string, any[]> =
        selectedType === 'All'
            ? uniqueTypes.reduce((acc: Record<string, any[]>, type: any) => {
                  acc[type] = documentsData.filter(
                      (item: any) => item.type === type
                  );
                  return acc;
              }, {})
            : {};

    const handleCloseOverlay = () => {
        setShowImageOverlay(false);
        setSelectedImage('');
    };

    return (
        <>
            {/* Image Overlay */}
            {showImageOverlay && selectedImage && (
                <div className='fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4'>
                    <div className='relative max-w-4xl w-full flex flex-col items-center'>
                        {/* Close button positioned at the top */}
                        <button
                            onClick={handleCloseOverlay}
                            className='absolute -top-10 right-0 text-white rounded-full w-8 h-8 flex items-center justify-center z-10'
                        >
                            ✕
                        </button>

                        {/* Image container centered */}
                        <div className='bg-white p-4 rounded w-full flex justify-center'>
                            <Image
                                src={`${process.env.NEXT_PUBLIC_BUCKET_URL}/${selectedImage}`}
                                alt='Document Preview'
                                width={1024}
                                height={768}
                                className='max-w-full max-h-[80vh] object-contain'
                                unoptimized={selectedImage.endsWith('.webp')}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className='mx-auto w-[98vw] bg-blue-50 rounded-xl py-8'>
                <div className='px-4 flex flex-col items-center gap-8'>
                    <h1>
                        {selectedType === 'All' ? 'All Notices' : selectedType}
                    </h1>

                    <div className='flex items-center gap-4 flex-wrap justify-center'>
                        <div
                            className={`rounded-lg ${
                                selectedType === 'All'
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-primary hover:bg-blue-100'
                            } px-4 py-2 text-sm font-medium transition duration-200 cursor-pointer`}
                            onClick={() => setSelectedType('All')}
                        >
                            All
                        </div>
                        {uniqueTypes.map((type) => (
                            <div
                                key={String(type)}
                                className={`rounded-lg ${
                                    selectedType === type
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-primary hover:bg-blue-100'
                                } px-4 py-2 text-sm font-medium transition duration-200 cursor-pointer`}
                                onClick={() => setSelectedType(type as string)}
                            >
                                {type as string}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-4 md:gap-12 mt-8'>
                {selectedType === 'All' ? (
                    Object.entries(groupedByType).map(
                        ([type, items]: [string, any]) => (
                            <div key={type} className='mb-8 space-y-8'>
                                <h1 className='text-center text-3xl'>{type}</h1>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-16'>
                                    {items.map((item: any, index: number) => (
                                        <DocumentCard
                                            key={index}
                                            item={item}
                                            onImageView={(file) => {
                                                setSelectedImage(file);
                                                setShowImageOverlay(true);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    )
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-16'>
                        {filteredItems.map((item: any, index: number) => (
                            <DocumentCard
                                key={index}
                                item={item}
                                onImageView={(file) => {
                                    setSelectedImage(file);
                                    setShowImageOverlay(true);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

const DocumentCard = ({
    item,
    onImageView,
}: {
    item: any;
    onImageView: (file: string) => void;
}) => {
    const isWebp = item?.file && item?.file.endsWith('.webp');
    const isPdf = item?.file && item?.file.endsWith('.pdf');

    const handleButtonClick = () => {
        if (isPdf) {
            window.open(
                `${process.env.NEXT_PUBLIC_BUCKET_URL}/${item?.file}`,
                '_blank'
            );
        } else if (isWebp) {
            onImageView(item?.file);
        }
    };

    let buttonText = 'See More';
    if (isPdf) {
        buttonText = 'View Document';
    } else if (isWebp) {
        buttonText = 'View Detail';
    }

    return (
        <div className='flex flex-col items-center gap-2 md:gap-4 p-4 border border-gray-200 rounded-lg shadow-lg'>
            <span className='self-end text-primary font-bold text-xs md:text-sm'>
                {item?.date?.split('T')[0]}
            </span>
            <p className='text-lg font-bold text-center'>{item?.title}</p>
            {item?.file && (
                <Button onClick={handleButtonClick}>{buttonText}</Button>
            )}
        </div>
    );
};

export default DocumentsPage;
