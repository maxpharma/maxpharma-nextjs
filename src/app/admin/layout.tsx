"use client";

import Admin from "@/api/admin";
import AuthGuard from "@/components/auth/AuthGuard";
import Sidebar from "@/components/Sidebar";
import { Helper } from "@/utils";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

export default function AdminLayout({ children }: PropsWithChildren) {
    const pathname = usePathname();

    const isPublicRoute = pathname === "/admin";

    if (isPublicRoute) {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        await Admin.logout().then(() => {
            Helper.removeUser();
            window.location.reload();
        });
    };

    return (
        // <AuthGuard>
        <div className='flex h-screen w-full bg-slate-50'>
            {!isPublicRoute && <Sidebar />}

            <div
                className={`${
                    !isPublicRoute ? "flex-1 overflow-auto" : "w-full"
                } `}
            >
                <nav className='py-4 px-8 shadow-md bg-white '>
                    <div className='flex justify-self-end'>
                        <span
                            className='text-red-700 hover:text-blue-600 cursor-pointer'
                            onClick={() => handleLogout()}
                        >
                            Logout
                        </span>
                    </div>
                </nav>
                <div className='custom-container py-8'>{children}</div>
            </div>
        </div>
        // </AuthGuard>
    );
}
