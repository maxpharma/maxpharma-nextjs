import { ArrowUpRight } from "lucide-react";
import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    className?: string;
}

const Button = ({
    children,
    type = "button",
    onClick,
    className,
}: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`bg-primary text-primary flex-center font-normal md:font-bold py-2 px-3 md:py-3 rounded-full gap-2 w-fit cursor-pointer group custom-transition ${className} `}
        >
            <span className='text-black text-xs md:text-base group-hover:text-white custom-transition'>
                {children}
            </span>
            <div className='flex-center p-1 bg-black group-hover:bg-white group-hover:rotate-45 rounded-full custom-transition'>
                <ArrowUpRight
                    size={16}
                    className='transition-colors duration-200'
                />
            </div>
        </button>
    );
};

export default Button;
