import { ArrowUpRight } from "lucide-react";
import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    className?: string;
    variant?: "link" | "submit"; // Fixed typo from "varient" to "variant"
    loading?: boolean;
    disabled?: boolean;
}

const Button = ({
    children,
    type = "button",
    onClick,
    className = "",
    variant = "link", // Fixed typo
    loading = false,
    disabled = false,
}: ButtonProps) => {
    // Common props for both button variants
    const buttonProps = {
        type,
        onClick,
        disabled: disabled || loading,
    };

    if (variant === "link") {
        return (
            <button
                {...buttonProps}
                className={`bg-primary text-primary flex-center font-normal md:font-bold py-2 px-3 md:py-3 rounded-full gap-2 w-fit cursor-pointer group custom-transition ${className}`}
            >
                <span className='text-white text-xs md:text-base group-hover:text-white custom-transition'>
                    {loading ? "Loading..." : children}
                </span>
                <div className='flex-center p-1 bg-white group-hover:bg-white group-hover:rotate-45 rounded-full custom-transition'>
                    <ArrowUpRight
                        size={16}
                        className='transition-colors duration-200'
                    />
                </div>
            </button>
        );
    }

    // Submit variant
    return (
        <button
            {...buttonProps}
            type='submit'
            className={`bg-primary text-white px-6 py-2 rounded-lg ${
                loading ? "opacity-70" : ""
            } ${className}`}
        >
            {loading ? "Loading..." : children}
        </button>
    );
};

export default Button;
