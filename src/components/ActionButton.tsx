import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    loading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    classname?: string;
}

const ActionButton = ({
    children,
    type = 'submit',
    loading = false,
    disabled = false,
    classname = '',
    onClick,
}: ButtonProps) => {
    return (
        <button
            className={`button ${classname}`}
            type={type}
            disabled={!!loading ? loading : disabled}
            onClick={onClick}
        >
            {loading ? 'loading...' : children}
        </button>
    );
};

export default ActionButton;
