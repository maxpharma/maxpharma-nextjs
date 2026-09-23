import Inquiry from "@/api/Inquiry";
import { deleteIcon } from "@/assets/svg";
import ConfirmationAlert from "@/components/ConfirmationAlert";
import DataTable from "@/components/DataTable";
import Overlay from "@/components/Overlay";
import SvgIcon from "@/components/SvgIcon";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ProductInquiryTableData = () => {
    const { items: dataRaw } = useSelector((state: any) => state.inquiries);
    const data = [...dataRaw].reverse();
    const bucketUrl = process.env.NEXT_PUBLIC_BUCKET_URL || "";

    const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const fetchData = async () => {
        await Inquiry.get();
    };

    useEffect(() => {
        if (!data?.length) {
            fetchData();
        }
    }, [data?.length]);

    // Reverse for latest first
    const dataList = Array.isArray(data) ? [...data].reverse() : [];

    const handleRowClick = (rowData: any) => {
        const fullInquiry = dataList.find(
            (item: any) => item.id === rowData.id
        );
        setSelectedInquiry(fullInquiry || null);
    };

    const handleDeleteClick = (id: number) => {
        setItemToDelete(id);
        setShowConfirmation(true);
    };

    const handleDelete = async () => {
        setShowConfirmation(false);
        if (itemToDelete != null) {
            try {
                await Inquiry.deleteItem(itemToDelete);
                setSelectedInquiry(null);
                fetchData();
            } catch (error) {
                console.error("Delete failed", error);
            }
        }
    };

    const getProductImage = (
        files: string[] | undefined,
        productName: string
    ) => {
        if (!files || !files.length) return null;
        return (
            <Image
                src={`${bucketUrl}/${files[0]}`}
                alt={productName || "Product"}
                width={60}
                height={60}
                className='object-cover rounded'
            />
        );
    };

    const forTableData = dataList.map((item: any) => ({
        id: item.id,
        productName: item.productData?.name || "",
        name: item.name,
        phone: item.phone,
        location: item.location,
        email: item.email,
        productImage: item.productData?.files?.length ? (
            <a
                href={`${bucketUrl}/${item.productData.files[0]}`}
                target='_blank'
                rel='noopener noreferrer'
            >
                {getProductImage(
                    item.productData.files,
                    item.productData?.name || ""
                )}
            </a>
        ) : (
            <span className='text-gray-400'>No Image</span>
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

    const columns = [
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
        {
            id: "productName",
            header: "Product Name",
            accessor: "productName",
            minWidth: 120,
        },
        {
            id: "productImage",
            header: "Product Image",
            accessor: "productImage",
            minWidth: 100,
        },
        { id: "actions", header: "Actions", accessor: "actions", minWidth: 80 },
    ];

    return (
        <>
            <div className='space-y-8'>
                <DataTable
                    columns={columns}
                    title='Product Inquiries'
                    data={forTableData || []}
                    emptyMessage='No Data Found'
                    actions={[]}
                    onRowClick={handleRowClick}
                />
            </div>
            <Overlay
                isOpen={!!selectedInquiry}
                onClose={() => setSelectedInquiry(null)}
            >
                {selectedInquiry && (
                    <div className='grid grid-cols-1 gap-6'>
                        <div className='flex'>
                            <div className='w-48 font-medium'>
                                Product Name:
                            </div>
                            <div className='text-gray-700'>
                                {selectedInquiry.productData?.name || ""}
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='w-48 font-medium'>Name:</div>
                            <div className='text-gray-700'>
                                {selectedInquiry.name}
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='w-48 font-medium'>
                                Contact Number:
                            </div>
                            <div className='text-gray-700'>
                                {selectedInquiry.phone}
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='w-48 font-medium'>Location:</div>
                            <div className='text-gray-700'>
                                {selectedInquiry.location}
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='w-48 font-medium'>Email:</div>
                            <div className='text-gray-700'>
                                {selectedInquiry.email}
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div className='w-full font-medium mb-2'>
                                Message:
                            </div>
                            <div className='text-gray-700'>
                                {selectedInquiry.message || (
                                    <span className='text-gray-400'>
                                        No message
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div className='w-full font-medium mb-2'>
                                Product Images:
                            </div>
                            <div className='flex gap-2 flex-wrap'>
                                {selectedInquiry.productData?.files?.length ? (
                                    selectedInquiry.productData.files.map(
                                        (file: string, idx: number) => (
                                            <a
                                                key={idx}
                                                href={`${bucketUrl}/${file}`}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                            >
                                                <Image
                                                    src={`${bucketUrl}/${file}`}
                                                    alt={
                                                        selectedInquiry
                                                            .productData
                                                            ?.name || "Product"
                                                    }
                                                    width={80}
                                                    height={80}
                                                    className='object-cover rounded'
                                                />
                                            </a>
                                        )
                                    )
                                ) : (
                                    <span className='text-gray-400'>
                                        No Images
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
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirmation(false)}
                />
            )}
        </>
    );
};

export default ProductInquiryTableData;
