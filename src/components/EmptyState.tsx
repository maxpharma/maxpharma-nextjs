import { emptyState } from "@/assets/commonSvg";
import SvgIcon from "./SvgIcon";

interface EmptyStateProps {
    title?: string;
    message?: string;
}

export default function EmptyState({
    title = "No Data Found",
    message = "Please try again later.",
}: EmptyStateProps) {
    return (
        <div className='mt-16 w-full flex flex-col items-center justify-center text-center gap-4'>
            <SvgIcon src={emptyState} />
            <h2 className='text-lg font-semibold'>{title}</h2>
            <p className='text-gray-500'>{message}</p>
        </div>
    );
}
