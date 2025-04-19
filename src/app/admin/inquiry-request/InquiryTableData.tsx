"use client";

import Applies from "@/api/applies";
import { deleteIcon } from "@/assets/svg";
import ConfirmationAlert from "@/components/ConfirmationAlert";
import DataTable from "@/components/DataTable";
import Overlay from "@/components/Overlay";
import SvgIcon from "@/components/SvgIcon";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Application {
    id: string | number;
    name: string;
    phone: string;
    citizenship?: string;
    bankDeposit?: string;
    requestForm?: string;
    type?: string;
    [key: string]: any;
}

const InquiryTableData = () => {
    const [selectedApplication, setSelectedApplication] =
        useState<Application | null>(null);
    const bucketUrl = process.env.NEXT_PUBLIC_BUCKET_URL || "";

    // Use applies selector
    const appliesData = useSelector((state: any) => state.applies?.items || []);

    const fetchApplications = async () => {
        try {
            await Applies.get();
        } catch (error) {
            console.error("Error fetching applies:", error);
        }
    };

    console.log("appliesData", appliesData);

    useEffect(() => {
        if (!appliesData?.length) {
            fetchApplications();
        }
    }, [appliesData?.length]);

    // No filtering, use all appliesData
    const dataList = Array.isArray(appliesData)
        ? [...appliesData].reverse()
        : [];

    // This function handles the row click
    const handleRowClick = (rowData: any) => {
        const fullApplication = dataList?.find(
            (item: any) => item.id === rowData.id
        );
        setSelectedApplication(fullApplication || null);
    };

    const forTableData = dataList?.map((item: any) => ({
        id: item.id,
        noticeTitle: item.noticeData?.title || "",
        name: item.name,
        phone: item.phone,
        location: item.location,
        email: item.email,
        file: item.file ? (
            <a
                href={`${bucketUrl}/${item.file}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 underline'
            >
                View File
            </a>
        ) : (
            <span className='text-gray-400'>No File</span>
        ),
        actions: (
            <div className='flex items-center gap-2'>
                <div
                    className='cursor-pointer'
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(item.id);
                    }}
                >
                    <SvgIcon src={deleteIcon} />
                </div>
            </div>
        ),
    }));

    const column = [
        {
            id: "noticeTitle",
            header: "Notice Title",
            accessor: "noticeTitle",
            minWidth: 120,
        },
        { id: "name", header: "Name", accessor: "name", minWidth: 100 },
        {
            id: "phone",
            header: "Contact Number",
            accessor: "phone",
            minWidth: 100,
        },
        {
            id: "location",
            header: "Location",
            accessor: "location",
            minWidth: 100,
        },
        { id: "email", header: "Email", accessor: "email", minWidth: 120 },
        { id: "file", header: "File", accessor: "file", minWidth: 100 },
        { id: "actions", header: "Actions", accessor: "actions", minWidth: 80 },
    ];

    // Function to get the full URL for documents
    const getDocumentUrl = (path: string | undefined) => {
        if (!path) return "";
        return `${bucketUrl}/${path}`;
    };

    // Function to determine if a file is an image
    const isImageFile = (path: string | undefined) => {
        if (!path) return false;
        const ext = path.split(".").pop()?.toLowerCase();
        return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "");
    };

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setItemToDelete(id);
        setShowConfirmation(true);
    };

    const handleDelete = async () => {
        setShowConfirmation(false);
        if (itemToDelete != null) {
            try {
                await Applies.deleteItem(itemToDelete);
                setSelectedApplication(null);
                // Optionally refresh the data
                fetchApplications();
            } catch (error) {
                // Optionally handle error (toast, etc)
                console.error("Delete failed", error);
            }
        }
    };

    return (
        <>
            <div className='space-y-8'>
                <DataTable
                    columns={column}
                    title='Applications'
                    data={forTableData || []}
                    emptyMessage='No Data Found'
                    actions={[]}
                    onRowClick={handleRowClick}
                />
            </div>
            <Overlay
                isOpen={!!selectedApplication}
                onClose={() => setSelectedApplication(null)}
            >
                {selectedApplication && (
                    <div className='grid grid-cols-1 gap-6'>
                        <div className='flex'>
                            <div className='w-48 font-medium'>
                                Notice Title:
                            </div>
                            <div className='text-gray-700'>
                                {selectedApplication.noticeData?.title || ""}
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='w-48 font-medium'>Name:</div>
                            <div className='text-gray-700'>
                                {selectedApplication.name}
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='w-48 font-medium'>
                                Contact Number:
                            </div>
                            <div className='text-gray-700'>
                                {selectedApplication.phone}
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='w-48 font-medium'>Location:</div>
                            <div className='text-gray-700'>
                                {selectedApplication.location}
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='w-48 font-medium'>Email:</div>
                            <div className='text-gray-700'>
                                {selectedApplication.email}
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div className='w-full font-medium mb-2'>
                                Message:
                            </div>
                            <div className='text-gray-700'>
                                {selectedApplication.message || (
                                    <span className='text-gray-400'>
                                        No message
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div className='w-full font-medium mb-2'>File:</div>
                            <div>
                                {selectedApplication.file ? (
                                    <a
                                        href={getDocumentUrl(
                                            selectedApplication.file
                                        )}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-blue-500 underline'
                                    >
                                        View File
                                    </a>
                                ) : (
                                    <span className='text-gray-400'>
                                        No File
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Overlay>
            {showConfirmation && (
                <ConfirmationAlert
                    message='Are you Sure you want to Delete This Data ?'
                    confirmText='YES'
                    cancelText='NO'
                    onConfirm={() => handleDelete()}
                    onCancel={() => setShowConfirmation(false)}
                />
            )}
        </>
    );
};

export default InquiryTableData;
