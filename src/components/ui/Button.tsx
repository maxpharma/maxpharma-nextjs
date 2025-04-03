import { ArrowUpRight } from 'lucide-react';
import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
}

const Button = ({ children, type = 'button', onClick }: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className='bg-primary text-primary flex-center font-normal md:font-bold py-2 px-3 md:py-3 rounded-full gap-2 w-fit cursor-pointer'
        >
            <span className='text-white text-xs md:text-base'>{children}</span>
            <div className='flex-center p-1 bg-white rounded-full'>
                <ArrowUpRight size={16} />
            </div>
        </button>
    );
};

export default Button;
