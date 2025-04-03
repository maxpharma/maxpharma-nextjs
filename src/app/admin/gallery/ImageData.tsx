import Gallery from '@/api/gallery';
import { deleteIcon, editIcon } from '@/assets/svg';
import ConfirmationAlert from '@/components/ConfirmationAlert';
import DataTable from '@/components/DataTable';
import SvgIcon from '@/components/SvgIcon';
import { label } from 'framer-motion/client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ImageData = ({ setUpdateIdData }: any) => {
    const fetchData = async () => {
        await Gallery.getImage('gallery');
    };

    const { items: galleryData } = useSelector((state: any) => state.gallery);

    useEffect(() => {
        if (!galleryData?.length) {
            fetchData();
        }
    }, [galleryData?.length, galleryData]);

    const columns = [
        { id: 'title', header: 'Title', accessor: 'title', minWidth: 170 },
        { id: 'image', header: 'Image', accessor: 'image', minWidth: 170 },
        {
            id: 'action',
            header: 'Action',
            accessor: 'action',
            minWidth: 170,
        },
    ];

    const rows = galleryData?.map((item: any) => {
        return {
            title: item?.title,
            image: item?.gallery?.length,
            action: (
                <div className='flex items-center gap-2'>
                    <button
                        onClick={() => {
                            setUpdateIdData({
                                id: item.id,
                                title: item.title,
                                gallery: item.gallery,
                            });
                        }}
                    >
                        <SvgIcon src={editIcon} />
                    </button>
                    <button
                        className='cursor-pointer'
                        onClick={() => handleDeleteClick(item.id)}
                    >
                        <SvgIcon src={deleteIcon} />
                    </button>
                </div>
            ),
        };
    });

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setItemToDelete(id);
        setShowConfirmation(true);
    };

    const handleDelete = async () => {
        if (itemToDelete !== null) {
            await Gallery.deleteItem(itemToDelete);
            setShowConfirmation(false);
            // Optionally refresh the data
            fetchData();
        }
    };

    return (
        <>
            <div>
                <DataTable
                    title='Images'
                    columns={columns}
                    data={rows}
                    emptyMessage='No images found'
                />
            </div>
            {showConfirmation && (
                <ConfirmationAlert
                    message='Are you Sure you want to Delete This Data ?'
                    confirmText='YES'
                    cancelText='NO'
                    onConfirm={() => handleDelete()} // Pass as a function reference
                    onCancel={() => setShowConfirmation(false)}
                />
            )}
        </>
    );
};

export default ImageData;
