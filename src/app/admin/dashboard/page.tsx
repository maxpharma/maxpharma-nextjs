'use client';

import Dashboard from '@/api/dashboard';
import {
    documentsIcon,
    galleryIcon,
    groupIcon,
    portfolioIcon,
    shareIcon,
    teamIcon,
} from '@/assets/svg';
import DataTable from '@/components/DataTable';
import StatsGrid from '@/components/StatsGrid';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const DashboardPage = () => {
    const router = useRouter();

    const fetchData = async () => {
        await Dashboard.getData('dashboard', 'dashboard');
    };

    const { data: dashboardData } = useSelector(
        (state: any) => state.dashboard
    );

    useEffect(() => {
        if (!dashboardData?.length) {
            fetchData();
        }
    }, [dashboardData?.length]);

    console.log('dashboardData', dashboardData);

    const dummyStats = [
        {
            title: 'New Share Requests Apply',
            value: dashboardData?.totalApplications,
            icon: shareIcon,
            iconBgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            title: 'Total Share Requests',
            value: dashboardData?.totalShareRequest?.items?.length,
            icon: shareIcon,
            iconBgColor: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            title: 'Total Inquirey',
            value: dashboardData?.totalInquiry?.items?.length,
            icon: groupIcon,
            iconBgColor: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
        },
        {
            title: 'TotalDocuments',
            value: dashboardData?.totalDocuments,
            icon: documentsIcon,
            iconBgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            title: 'Total Portfolio',
            value: dashboardData?.totalPortfolio,
            icon: portfolioIcon,
            iconBgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            title: 'Total Gallery',
            value: dashboardData?.totalGallery,
            icon: galleryIcon,
            iconBgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            title: 'Total Team',
            value: dashboardData?.totalTeam,
            icon: teamIcon,
            iconBgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            title: 'Total Settings',
            value: dashboardData?.totalSetting,
            icon: teamIcon,
            iconBgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
    ];

    const shareRequestColumns = [
        {
            id: 'name',
            header: 'Name/Business Name',
            accessor: 'name',
            minWidth: 80,
        },
        {
            id: 'phone',
            header: 'Phone Number',
            accessor: 'phone',
            minWidth: 80,
        },
        { id: 'file', header: 'File', accessor: 'file', minWidth: 80 },
        { id: 'action', header: 'Action', accessor: 'action', minWidth: 80 },
    ];

    const shareRequestRows = dashboardData?.totalShareRequest?.items?.map(
        (item: any) => {
            return {
                name: item?.name,
                phone: item?.phone,
                file: (
                    <div className='text-white bg-blue-400 rounded-lg p-1'>
                        Share Apply
                    </div>
                ),
                action: (
                    <button
                        onClick={() => {
                            router.push('/admin/share-request');
                        }}
                        className='text-green-800 bg-white border border-green-800 rounded-md px-4 py-1'
                    >
                        View
                    </button>
                ),
            };
        }
    );

    const newInquiryColums = [
        {
            id: 'name',
            header: 'Name',
            accessor: 'name',
            minWidth: 80,
        },
        {
            id: 'phone',
            header: 'Phone Number',
            accessor: 'phone',
            minWidth: 80,
        },
        { id: 'action', header: 'Action', accessor: 'action', minWidth: 80 },
    ];

    const newInquiryRows = dashboardData?.totalInquiry?.items?.map(
        (item: any) => {
            return {
                name: item?.name,
                phone: item?.phone,
                action: (
                    <button
                        onClick={() => {
                            router.push('/admin/contact-list');
                        }}
                        className='text-green-800 bg-white border border-green-800 rounded-md px-4 py-1'
                    >
                        View
                    </button>
                ),
            };
        }
    );

    return (
        <div className='p-6'>
            <StatsGrid stats={dummyStats} />

            <div className='mt-8 flex gap-2 justify-between'>
                <DataTable
                    title='Recent Share Requests'
                    columns={shareRequestColumns}
                    data={shareRequestRows}
                    emptyMessage='No share requests found'
                />
                <DataTable
                    title='New Inquirey'
                    columns={newInquiryColums}
                    data={newInquiryRows}
                    emptyMessage='No Inquiry requests found'
                />
            </div>
        </div>
    );
};

export default DashboardPage;
