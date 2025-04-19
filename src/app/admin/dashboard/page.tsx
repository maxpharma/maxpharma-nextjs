"use client";

import Dashboard from "@/api/dashboard";
import {
    documentsIcon,
    galleryIcon,
    groupIcon,
    portfolioIcon,
    shareIcon,
    teamIcon,
} from "@/assets/svg";
import DataTable from "@/components/DataTable";
import StatsGrid from "@/components/StatsGrid";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const DashboardPage = () => {
    const router = useRouter();

    const fetchData = async () => {
        await Dashboard.getData("dashboard", "dashboard");
    };

    const { data: dashboardData } = useSelector(
        (state: any) => state.dashboard
    );

    useEffect(() => {
        if (!dashboardData?.length) {
            fetchData();
        }
    }, [dashboardData?.length]);

    console.log("dashboardData", dashboardData);

    const dummyStats = [
        {
            title: "New Apply Requests",
            value: dashboardData?.totalApply,
            icon: shareIcon,
            iconBgColor: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            title: "Total Gallery",
            value: dashboardData?.totalGallery,
            icon: galleryIcon,
            iconBgColor: "bg-purple-100",
            iconColor: "text-purple-600",
        },
        {
            title: "Total Contact",
            value: dashboardData?.totalContact,
            icon: groupIcon,
            iconBgColor: "bg-yellow-100",
            iconColor: "text-yellow-600",
        },
        {
            title: "Total Services",
            value: dashboardData?.totalServices,
            icon: documentsIcon,
            iconBgColor: "bg-purple-100",
            iconColor: "text-purple-600",
        },
        {
            title: "Total Settings",
            value: dashboardData?.totalSetting,
            icon: teamIcon,
            iconBgColor: "bg-purple-100",
            iconColor: "text-purple-600",
        },
        {
            title: "Total Notices",
            value: dashboardData?.totalNotices,
            icon: documentsIcon,
            iconBgColor: "bg-purple-100",
            iconColor: "text-purple-600",
        },
        {
            title: "Total Products",
            value: dashboardData?.totalProduct,
            icon: portfolioIcon,
            iconBgColor: "bg-purple-100",
            iconColor: "text-purple-600",
        },
        {
            title: "Total Inquiry",
            value: dashboardData?.totalInquiry,
            icon: groupIcon,
            iconBgColor: "bg-yellow-100",
            iconColor: "text-yellow-600",
        },
    ];

    const applyColumns = [
        {
            id: "name",
            header: "Name",
            accessor: "name",
            minWidth: 80,
        },
        {
            id: "phone",
            header: "Phone Number",
            accessor: "phone",
            minWidth: 80,
        },
        { id: "file", header: "File", accessor: "file", minWidth: 80 },
        { id: "action", header: "Action", accessor: "action", minWidth: 80 },
    ];

    const applyRows = dashboardData?.applyData?.items?.map((item: any) => {
        return {
            name: item?.name,
            phone: item?.phone,
            file: (
                <a
                    href={`/${item?.file}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-white bg-blue-400 rounded-lg p-1'
                >
                    Download
                </a>
            ),
            action: (
                <button
                    onClick={() => {
                        router.push("/admin/apply-list");
                    }}
                    className='text-green-800 bg-white border border-green-800 rounded-md px-4 py-1'
                >
                    View
                </button>
            ),
        };
    });

    const inquiryColumns = [
        {
            id: "name",
            header: "Name",
            accessor: "name",
            minWidth: 80,
        },
        {
            id: "phone",
            header: "Phone Number",
            accessor: "phone",
            minWidth: 80,
        },
        { id: "action", header: "Action", accessor: "action", minWidth: 80 },
    ];

    const inquiryRows = dashboardData?.inquiryData?.items?.map((item: any) => {
        return {
            name: item?.name,
            phone: item?.phone,
            action: (
                <button
                    onClick={() => {
                        router.push("/admin/contact-list");
                    }}
                    className='text-green-800 bg-white border border-green-800 rounded-md px-4 py-1'
                >
                    View
                </button>
            ),
        };
    });

    return (
        <div className='p-6'>
            <StatsGrid stats={dummyStats} />

            <div className='mt-8 flex max-lg:flex-col gap-2 justify-between'>
                <DataTable
                    title='Recent Apply Requests'
                    columns={applyColumns}
                    data={applyRows}
                    emptyMessage='No apply requests found'
                />
                <DataTable
                    title='New Inquiry'
                    columns={inquiryColumns}
                    data={inquiryRows}
                    emptyMessage='No inquiry requests found'
                />
            </div>
        </div>
    );
};

export default DashboardPage;
