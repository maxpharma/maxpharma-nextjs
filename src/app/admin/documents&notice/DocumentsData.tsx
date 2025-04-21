import { default as Documents, default as Notice } from "@/api/notice";
import { deleteIcon, editIcon } from "@/assets/svg";
import ConfirmationAlert from "@/components/ConfirmationAlert";
import CustomImage from "@/components/CustomImage";
import DataTable from "@/components/DataTable";
import SvgIcon from "@/components/SvgIcon";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DocumentsData = ({ setUpdateIdData }: any) => {
    const fetchData = async () => {
        await Notice.get();
    };
    const { items: NoticeData } = useSelector((state: any) => state.notices);
    useEffect(() => {
        if (!NoticeData?.length) {
            fetchData();
        }
    }, [NoticeData?.length]);
    const columns = [
        {
            id: "document",
            header: "Document",
            accessor: "document",
            minWidth: 170,
        },
        { id: "title", header: "Title", accessor: "title", minWidth: 170 },
        { id: "date", header: "Date", accessor: "date", minWidth: 170 },
        {
            id: "fileLink",
            header: "File Link",
            accessor: "fileLink",
            minWidth: 170,
        },
        { id: "action", header: "Action", accessor: "action", minWidth: 170 },
    ];
    const rows = NoticeData?.map((item: any) => {
        return {
            document: item?.documentType,
            title: item?.title,
            date: item?.date.split("T")[0],
            fileLink: (
                <div>
                    {
                        // if file link ends with .pdf then show view document else just render image
                        item?.file?.endsWith(".pdf") ? (
                            <a
                                href={`${process.env.NEXT_PUBLIC_BUCKET_URL}/${item?.file}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-500 underline'
                            >
                                View Document
                            </a>
                        ) : (
                            <a
                                href={`${process.env.NEXT_PUBLIC_BUCKET_URL}/${item?.file}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-500 underline'
                            >
                                <CustomImage
                                    src={`${process.env.NEXT_PUBLIC_BUCKET_URL}/${item?.file}`}
                                    size='small'
                                />
                            </a>
                        )
                    }
                </div>
            ),
            action: (
                <div className='flex gap-2'>
                    <button
                        onClick={() => {
                            setUpdateIdData({
                                id: item.id,
                                title: item.title,
                                type: item.type,
                                date: item.date.split("T")[0],
                                file: item.file,
                            });
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className='p-2'
                    >
                        <SvgIcon src={editIcon} />
                    </button>
                    <button onClick={() => handleDeleteClick(item.id)}>
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
            await Documents.deleteItem(itemToDelete);
            setShowConfirmation(false);
            // Optionally refresh the data
            fetchData();
        }
    };
    return (
        <>
            <div>
                <DataTable
                    title='Documents'
                    columns={columns}
                    data={rows}
                    emptyMessage='No documents found'
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

export default DocumentsData;
