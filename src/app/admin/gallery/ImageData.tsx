import Gallery from "@/api/gallery";
import { deleteIcon, editIcon } from "@/assets/svg";
import ConfirmationAlert from "@/components/ConfirmationAlert";
import DataTable from "@/components/DataTable";
import SvgIcon from "@/components/SvgIcon";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ImageData = ({ setUpdateIdData }: any) => {
    const fetchData = async () => {
        await Gallery.getImage("gallery");
    };

    const { items: galleryData } = useSelector((state: any) => state.gallery);

    useEffect(() => {
        // Only fetch once on mount
        if (!galleryData || galleryData.length === 0) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Remove galleryData from dependencies

    const columns = [
        { id: "title", header: "Title", accessor: "title", minWidth: 170 },
        { id: "images", header: "Images", accessor: "images", minWidth: 220 },
        {
            id: "action",
            header: "Action",
            accessor: "action",
            minWidth: 120,
        },
    ];

    const rows = galleryData?.map((item: any) => {
        const files = item?.files || [];
        return {
            title: item?.title,
            images: (
                <div className='flex items-center gap-1'>
                    {files.slice(0, 5).map((file: string, idx: number) => (
                        <div
                            key={idx}
                            className='relative w-8 h-8 rounded overflow-hidden border border-gray-200'
                        >
                            <Image
                                src={`${process.env.NEXT_PUBLIC_BUCKET_URL}/${file}`}
                                alt={`img-${idx}`}
                                fill
                                className='object-cover'
                            />
                        </div>
                    ))}
                    {files.length > 0 && (
                        <span className='ml-2 text-xs text-gray-500'>
                            ({files.length})
                        </span>
                    )}
                </div>
            ),
            action: (
                <div className='flex items-center gap-2'>
                    <button
                        onClick={() => {
                            setUpdateIdData({
                                id: item.id,
                                title: item.title,
                                gallery: files.map(
                                    (file: string, idx: number) => ({
                                        id: idx, // You may want to use a real id if available
                                        galleryId: item.id,
                                        file,
                                    })
                                ),
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
