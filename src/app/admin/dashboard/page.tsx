"use client";

import Applies from "@/api/applies";
import Contact from "@/api/contacts";
import Dashboard from "@/api/dashboard";
import Inquiry from "@/api/Inquiry";
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

    // Get data from redux (as in respective pages)
    const appliesData = useSelector((state: any) => state.applies?.items || []);
    const inquiriesData = useSelector(
        (state: any) => state.inquiries?.items || []
    );

    const fetchApplications = async () => {
        try {
            await Applies.get();
        } catch (error) {
            console.error("Error fetching applies:", error);
        }
    };

    useEffect(() => {
        if (!appliesData?.length) {
            fetchApplications();
        }
    }, [appliesData?.length]);

    const fetchProductData = async () => {
        await Inquiry.get();
    };

    useEffect(() => {
        if (!inquiriesData?.length) {
            fetchProductData();
        }
    }, [inquiriesData?.length]);

    const contactsData = useSelector(
        (state: any) => state.contacts?.items || []
    );

    const fetchContactData = async () => {
        await Contact.getAll();
    };

    useEffect(() => {
        if (!contactsData?.length) {
            fetchContactData();
        }
    }, [contactsData?.length]);

    const bucketUrl = process.env.NEXT_PUBLIC_BUCKET_URL || "";

    useEffect(() => {
        if (!dashboardData?.length) {
            fetchData();
        }
    }, [dashboardData?.length]);

    // Compose left table: Career Apply + Product Inquiry (latest first)
    const careerApplyRows = Array.isArray(appliesData)
        ? [...appliesData]
              .reverse()
              .slice(0, 5)
              .map((item: any) => ({
                  id:
                      item?.id ??
                      `${item?.name ?? "career"}-${
                          item?.phone ?? Math.random()
                      }`,
                  type: "Career Apply",
                  name: item?.name,
                  phone: item?.phone,

                  action: (
                      <button
                          onClick={() => router.push("/admin/inquiry-request")}
                          className='text-green-800 bg-white border border-green-800 rounded-md px-4 py-1'
                      >
                          View
                      </button>
                  ),
              }))
        : [];

    const productInquiryRows = Array.isArray(inquiriesData)
        ? [...inquiriesData]
              .reverse()
              .slice(0, 5)
              .map((item: any) => ({
                  id:
                      item?.id ??
                      `${item?.name ?? "inquiry"}-${
                          item?.phone ?? Math.random()
                      }`,
                  type: "Product Inquiry",
                  name: item?.name,
                  phone: item?.phone,

                  action: (
                      <button
                          onClick={() => router.push("/admin/inquiry-request")}
                          className='text-green-800 bg-white border border-green-800 rounded-md px-4 py-1'
                      >
                          View
                      </button>
                  ),
              }))
        : [];

    const leftTableRows = [...careerApplyRows, ...productInquiryRows].slice(
        0,
        8
    );

    const leftTableColumns = [
        { id: "type", header: "Type", accessor: "type", minWidth: 80 },
        { id: "name", header: "Name", accessor: "name", minWidth: 80 },
        {
            id: "phone",
            header: "Phone Number",
            accessor: "phone",
            minWidth: 80,
        },

        { id: "action", header: "Action", accessor: "action", minWidth: 80 },
    ];

    const contactRows = Array.isArray(contactsData)
        ? [...contactsData]
              .reverse()
              .slice(0, 8)
              .map((item: any) => ({
                  id:
                      item?.id ??
                      `${item?.email ?? "contact"}-${
                          item?.phone ?? Math.random()
                      }`,
                  name: item?.name,
                  phone: item?.phone,
                  email: item?.email,
                  action: (
                      <button
                          onClick={() => router.push("/admin/contact-list")}
                          className='text-green-800 bg-white border border-green-800 rounded-md px-4 py-1'
                      >
                          View
                      </button>
                  ),
              }))
        : [];

    const contactColumns = [
        { id: "name", header: "Name", accessor: "name", minWidth: 80 },
        {
            id: "phone",
            header: "Phone Number",
            accessor: "phone",
            minWidth: 80,
        },
        { id: "email", header: "Email", accessor: "email", minWidth: 120 },
        { id: "action", header: "Action", accessor: "action", minWidth: 80 },
    ];

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

    return (
        <div className='p-6'>
            <StatsGrid stats={dummyStats} />

            <div className='mt-8 flex max-lg:flex-col gap-8 justify-between'>
                <DataTable
                    title='Career Apply & Product Inquiry'
                    columns={leftTableColumns}
                    data={leftTableRows}
                    emptyMessage='No apply or product inquiry requests found'
                    className='flex-1'
                />
                <DataTable
                    title='Contact Inquiries'
                    columns={contactColumns}
                    data={contactRows}
                    emptyMessage='No contact inquiries found'
                />
            </div>
        </div>
    );
};

export default DashboardPage;
