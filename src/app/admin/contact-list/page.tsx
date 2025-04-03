'use client';

import Contact from '@/api/contacts';
import DataTable from '@/components/DataTable';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { deleteIcon } from '@/assets/svg';
import SvgIcon from '@/components/SvgIcon';
import ConfirmationAlert from '@/components/ConfirmationAlert';

interface ContactItem {
    id: string | number;
    name: string;
    phone: string;
    email: string;
    subject: string;
    message: string;
    createdAt?: string;
    [key: string]: any;
}

const ContactList = () => {
    const { items: contactData } = useSelector((state: any) => state.contacts);
    const [selectedContact, setSelectedContact] = useState<ContactItem | null>(
        null
    );

    const fetchData = async () => {
        await Contact.getAll('contacts');
    };

    useEffect(() => {
        if (!contactData?.length) {
            fetchData();
        }
    }, [contactData?.length]);

    const handleRowClick = (rowData: any) => {
        const fullContact = contactData?.find(
            (item: any) => item.id === rowData.id
        );
        setSelectedContact(fullContact || null);
    };

    const columns = [
        { id: 'name', header: 'Name', accessor: 'name', minWidth: 170 },
        { id: 'phone', header: 'Phone', accessor: 'phone', minWidth: 170 },
        { id: 'email', header: 'Email', accessor: 'email', minWidth: 170 },
        {
            id: 'subject',
            header: 'Subject',
            accessor: 'subject',
            minWidth: 170,
        },
        {
            id: 'action',
            header: 'Actions',
            accessor: 'action',
            minWidth: 100,
        },
    ];

    const rows =
        contactData?.map((item: ContactItem) => {
            return {
                id: item.id,
                name: item.name,
                phone: item.phone,
                email: item.email,
                subject: item.subject,
                action: (
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Stop the row click event from firing
                                handleDeleteClick(item.id as number);
                            }}
                            className='cursor-pointer relative z-50'
                        >
                            <SvgIcon src={deleteIcon} />
                        </button>
                    </div>
                ),
            };
        }) || [];

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setItemToDelete(id);
        setShowConfirmation(true);
    };

    const handleDelete = async () => {
        if (itemToDelete !== null) {
            await Contact.deleteItem('contacts', itemToDelete);
            setShowConfirmation(false);
            // Optionally refresh the data
            fetchData();
        }
    };

    return (
        <>
            <div className='space-y-8'>
                <div className='bg-white  '>
                    <DataTable
                        title='Contact Requests'
                        columns={columns}
                        data={rows}
                        emptyMessage='No contact requests found'
                        onRowClick={handleRowClick}
                    />
                </div>

                {selectedContact && (
                    <div className='mt-8 bg-blue-50 p-6 rounded-md shadow-sm'>
                        <h3 className='text-xl font-semibold mb-4'>
                            Contact Details
                        </h3>
                        <div className='grid grid-cols-1 gap-6'>
                            <div className='flex'>
                                <div className='w-48 font-medium'>Name:</div>
                                <div className='text-gray-700'>
                                    {selectedContact.name}
                                </div>
                            </div>
                            <div className='flex'>
                                <div className='w-48 font-medium'>Phone:</div>
                                <div className='text-gray-700'>
                                    {selectedContact.phone}
                                </div>
                            </div>
                            <div className='flex'>
                                <div className='w-48 font-medium'>Email:</div>
                                <div className='text-gray-700'>
                                    {selectedContact.email}
                                </div>
                            </div>
                            <div className='flex'>
                                <div className='w-48 font-medium'>Subject:</div>
                                <div className='text-gray-700'>
                                    {selectedContact.subject}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <div className='font-medium mb-2'>Message:</div>
                                <div className='text-gray-700 bg-white p-4 rounded border border-gray-200 min-h-[100px]'>
                                    {selectedContact.message}
                                </div>
                            </div>
                            {selectedContact.createdAt && (
                                <div className='flex'>
                                    <div className='w-48 font-medium'>
                                        Submitted on:
                                    </div>
                                    <div className='text-gray-700'>
                                        {formatDate(selectedContact.createdAt)}
                                    </div>
                                </div>
                            )}
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

export default ContactList;
