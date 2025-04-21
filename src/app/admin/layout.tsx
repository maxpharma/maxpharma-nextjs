"use client";

import Admin from "@/api/admin";
import Sidebar from "@/components/Sidebar";
import websiteData from "@/features/data";
import helpers from "@/utils/helper";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedUser = helpers.getUser();
        setUser(storedUser);
        setLoading(false);
    }, []);

    // Redirect logic
    useEffect(() => {
        if (!loading && user?.token) {
            if (pathname === "/admin") {
                router.push("/admin/dashboard");
            }
        } else if (!loading && !user?.token && pathname !== "/admin") {
            router.push("/admin");
        }
    }, [loading, user, pathname, router]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const isPublicRoute = pathname === "/admin";

    const handleLogout = async () => {
        try {
            await Admin.logout();
            helpers.removeUser();
            window.location.reload();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen w-full'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto'></div>
                    <p className='mt-4'>Authenticating...</p>
                </div>
            </div>
        );
    }

    if (isPublicRoute) {
        return <>{children}</>;
    }

    return (
        <div className='flex h-screen w-full bg-slate-50'>
            {!isPublicRoute && <Sidebar />}

            <div
                className={`${
                    !isPublicRoute ? "flex-1 overflow-auto" : "w-full"
                } `}
            >
                <nav className='py-4 px-8 shadow-md bg-white flex justify-end gap-4'>
                    <button className='button' onClick={() => router.push("/")}>
                        Visit Website
                    </button>
                    <button
                        className='secondary-button'
                        onClick={() => router.push(websiteData.inflancerCrm)}
                    >
                        Inflancer CRM
                    </button>
                    {/* Profile with dropdown */}
                    <div className='relative' ref={profileRef}>
                        <div
                            className='flex items-center gap-2 cursor-pointer select-none'
                            onClick={() => setDropdownOpen((open) => !open)}
                        >
                            <div className='w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200'>
                                <Image
                                    src='/images/medicine.png'
                                    alt='Admin'
                                    width={48}
                                    height={48}
                                    className='object-cover w-full h-full'
                                />
                            </div>
                            <span>{user?.name || "Admin Name"}</span>
                            <svg
                                className={`w-4 h-4 ml-1 transition-transform ${
                                    dropdownOpen ? "rotate-180" : ""
                                }`}
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M19 9l-7 7-7-7'
                                />
                            </svg>
                        </div>
                        {dropdownOpen && (
                            <div className='absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50'>
                                <button
                                    className='block w-full text-left px-4 py-2 hover:bg-gray-100'
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
                <div className='custom-container py-8'>{children}</div>
            </div>
        </div>
    );
}
