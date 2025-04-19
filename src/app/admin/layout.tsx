"use client";

import Admin from "@/api/admin";
import Sidebar from "@/components/Sidebar";
import { Helper } from "@/utils";
import helpers from "@/utils/helper";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";

export default function AdminLayout({ children }: PropsWithChildren) {
    const pathname = usePathname();
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = helpers.getUser();
        setUser(storedUser);
        setLoading(false);
        console.log("AdminLayout", storedUser);
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

    const isPublicRoute = pathname === "/admin";

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

    if (!isPublicRoute && !user?.token) {
        // Optionally, redirect to login or show nothing
        return null;
    }

    const handleLogout = async () => {
        await Admin.logout().then(() => {
            Helper.removeUser();
            window.location.reload();
        });
    };

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
                    <button className='secondary-button'>Inflancer CRM</button>
                </nav>
                <div className='custom-container py-8'>{children}</div>
            </div>
        </div>
    );
}
