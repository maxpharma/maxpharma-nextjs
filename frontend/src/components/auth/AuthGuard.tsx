"use client";

import { Helper } from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = Helper.getUser();
        setUser(storedUser);
        setLoading(false);
    }, []);

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

    return user?.token ? <>{children}</> : null;
};

export default AuthGuard;
