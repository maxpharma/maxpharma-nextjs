// app/not-found.tsx
import CustomImage from "@/components/CustomImage";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className='flex flex-col gap-4 items-center justify-center h-[80vh]'>
            <CustomImage
                src='/images/not-found.png'
                size='medium'
                orientation='landscape'
            />
            <span className='py-1 px-2 bg-red-100 text-red-900 rounded-lg'>
                404 Error
            </span>
            <p className='text-xl mt-2 max-md:max-w-[90%] max-w-[600px] text-center'>
                Sorry, the page you are looking for doesn’t exist or has been
                removed. Keep exploring out site:
            </p>
            <Link href='/' className='button'>
                Go Back Home
            </Link>
        </div>
    );
}
