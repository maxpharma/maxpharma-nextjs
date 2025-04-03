'use client';

import Applications from '@/api/applications';
import { deleteIcon, editIcon } from '@/assets/svg';
import ConfirmationAlert from '@/components/ConfirmationAlert';
import DataTable from '@/components/DataTable';
import SvgIcon from '@/components/SvgIcon';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface Application {
    id: string | number;
    name: string;
    phone: string;
    citizenship?: string;
    bankDeposit?: string;
    requestForm?: string;
    [key: string]: any;
}

const ShareRequest = () => {
    const [selectedApplication, setSelectedApplication] =
        useState<Application | null>(null);
    const bucketUrl = process.env.NEXT_PUBLIC_BUCKET_URL || '';

    const { items: applicationList } = useSelector(
        (state: any) => state.applications
    );

    const fetchApplications = async () => {
        try {
            const res = await Applications.getAll('applications');
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    useEffect(() => {
        if (!applicationList?.length) {
            fetchApplications();
        }
    }, [applicationList?.length]);

    console.log('applicationList', applicationList);

    // This function handles the row click
    const handleRowClick = (rowData: any) => {
        // Find the full application data based on the row's id
        const fullApplication = applicationList?.find(
            (item: any) => item.id === rowData.id
        );

        if (selectedApplication?.id === rowData.id) {
            setSelectedApplication(null);
            return;
        }

        setSelectedApplication(fullApplication || null);
    };

    const forTableData = applicationList?.map((item: any) => {
        return {
            id: item.id,
            name: item.name,
            phone: item.phone,
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
        };
    });

    const column = [
        { id: 'id', header: 'ID', accessor: 'id', minWidth: 100 },
        { id: 'name', header: 'Name', accessor: 'name', minWidth: 100 },
        {
            id: 'phone',
            header: 'Contact Number',
            accessor: 'phone',
            minWidth: 100,
        },
        {
            id: 'actions',
            header: 'Actions',
            accessor: 'actions',
            minWidth: 100,
        },
    ];

    // Function to get the full URL for documents
    const getDocumentUrl = (path: string | undefined) => {
        if (!path) return '';
        return `${bucketUrl}/${path}`;
    };

    // Function to determine if a file is an image
    const isImageFile = (path: string | undefined) => {
        if (!path) return false;
        const ext = path.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
    };

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setItemToDelete(id);
        setShowConfirmation(true);
    };

    const handleDelete = async () => {
        if (itemToDelete !== null) {
            await Applications.deleteItem(itemToDelete);
            setShowConfirmation(false);
            // Optionally refresh the data
            fetchApplications();
        }
    };

    return (
        <>
            <div className='space-y-8'>
                <DataTable
                    columns={column}
                    title='Share Request'
                    data={forTableData || []}
                    emptyMessage='No Share Request Found'
                    actions={[]}
                    onRowClick={handleRowClick}
                />

                {selectedApplication && (
                    <div className='mt-8 bg-blue-50 p-6 rounded-md shadow-sm'>
                        <div className='grid grid-cols-1 gap-6'>
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
                            <div className='flex flex-col'>
                                <div className='w-full font-medium mb-2'>
                                    Citizenship With Signature:
                                </div>
                                <div className='border border-dashed border-gray-300 rounded-md p-4 h-48 flex items-center justify-center bg-white'>
                                    {selectedApplication.citizenship ? (
                                        isImageFile(
                                            selectedApplication.citizenship
                                        ) ? (
                                            <div className='relative w-full h-full'>
                                                <Image
                                                    src={getDocumentUrl(
                                                        selectedApplication.citizenship
                                                    )}
                                                    alt='Citizenship document'
                                                    fill
                                                    style={{
                                                        objectFit: 'contain',
                                                    }}
                                                    sizes='(max-width: 768px) 100vw, 50vw'
                                                />
                                            </div>
                                        ) : (
                                            <Link
                                                href={getDocumentUrl(
                                                    selectedApplication.citizenship
                                                )}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='text-blue-500 hover:text-blue-700 underline flex items-center gap-2'
                                            >
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    className='h-5 w-5'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                    stroke='currentColor'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth={2}
                                                        d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                                                    />
                                                </svg>
                                                View Citizenship Document
                                            </Link>
                                        )
                                    ) : (
                                        <span className='text-gray-400'>
                                            Citizenship.jpg
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <div className='w-full font-medium mb-2'>
                                    Bank Deposit Voucher:
                                </div>
                                <div className='border border-dashed border-gray-300 rounded-md p-4 h-48 flex items-center justify-center bg-white'>
                                    {selectedApplication.bankDeposit ? (
                                        isImageFile(
                                            selectedApplication.bankDeposit
                                        ) ? (
                                            <div className='relative w-full h-full'>
                                                <a
                                                    href={getDocumentUrl(
                                                        selectedApplication.bankDeposit
                                                    )}
                                                    download
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                >
                                                    <Image
                                                        src={getDocumentUrl(
                                                            selectedApplication.bankDeposit
                                                        )}
                                                        alt='Bank deposit voucher'
                                                        fill
                                                        style={{
                                                            objectFit:
                                                                'contain',
                                                        }}
                                                        sizes='(max-width: 768px) 100vw, 50vw'
                                                    />
                                                </a>
                                            </div>
                                        ) : (
                                            <Link
                                                href={getDocumentUrl(
                                                    selectedApplication.bankDeposit
                                                )}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='text-blue-500 hover:text-blue-700 underline flex items-center gap-2'
                                            >
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    className='h-5 w-5'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                    stroke='currentColor'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth={2}
                                                        d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                                                    />
                                                </svg>
                                                View Bank Deposit Voucher
                                            </Link>
                                        )
                                    ) : (
                                        <span className='text-gray-400'>
                                            Voucher.jpg
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <div className='w-full font-medium mb-2'>
                                    Share Request Application:
                                </div>
                                <div className='border border-dashed border-gray-300 rounded-md p-4 h-48 flex items-center justify-center bg-white'>
                                    {selectedApplication.requestForm ? (
                                        isImageFile(
                                            selectedApplication.requestForm
                                        ) ? (
                                            <div className='relative w-full h-full'>
                                                <a
                                                    href={getDocumentUrl(
                                                        selectedApplication.requestForm
                                                    )}
                                                    download
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='flex items-center gap-2'
                                                >
                                                    <Image
                                                        src={getDocumentUrl(
                                                            selectedApplication.requestForm
                                                        )}
                                                        alt='Share request application'
                                                        fill
                                                        style={{
                                                            objectFit:
                                                                'contain',
                                                        }}
                                                        sizes='(max-width: 768px) 100vw, 50vw'
                                                    />
                                                </a>
                                            </div>
                                        ) : (
                                            <Link
                                                href={getDocumentUrl(
                                                    selectedApplication.requestForm
                                                )}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='text-blue-500 hover:text-blue-700 underline flex items-center gap-2'
                                            >
                                                <svg
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    className='h-5 w-5'
                                                    fill='none'
                                                    viewBox='0 0 24 24'
                                                    stroke='currentColor'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth={2}
                                                        d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                                                    />
                                                </svg>
                                                View Share Request Application
                                            </Link>
                                        )
                                    ) : (
                                        <span className='text-gray-400'>
                                            ShareRequest.pdf
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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

export default ShareRequest;
