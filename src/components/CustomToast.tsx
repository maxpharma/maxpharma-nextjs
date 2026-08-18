// components/CustomToast.tsx
import { FC, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

interface CustomToastProps {
    title: string;
    message: string;
    buttonText?: string;
    labelText?: string;
    duration?: number;
    onButtonClick?: () => void;
    onClose?: () => void;
}

const CustomToast: FC<CustomToastProps> = ({
    title,
    message,
    buttonText,
    labelText,
    duration = 1000,
    onButtonClick,
    onClose,
}) => {
    const [isShowing, setIsShowing] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsShowing(true);
        }, 10);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        // Wait for animation to complete before unmounting
        setTimeout(() => {
            setIsMounted(false);
            setTimeout(() => {
                onClose?.();
            }, 50);
        }, 300);
    }, [onClose]);

    useEffect(() => {
        let autoCloseTimer: NodeJS.Timeout;

        if (duration) {
            autoCloseTimer = setTimeout(() => {
                handleClose();
            }, duration);
        }

        return () => {
            if (autoCloseTimer) clearTimeout(autoCloseTimer);
        };
    }, [duration, handleClose]);

    const handleButtonClick = () => {
        setIsClosing(true);
        // Wait for animation to complete before triggering callback
        setTimeout(() => {
            setIsMounted(false);
            setTimeout(() => {
                onButtonClick?.();
            }, 50);
        }, 300);
    };

    if (!isMounted) return null;

    return (
        <div
            className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 
    ${isShowing ? 'opacity-100' : 'opacity-0'} 
    ${isClosing ? 'opacity-0' : ''}
    transition-opacity duration-300`}
        >
            <div
                className={`
    bg-white rounded-lg p-6 max-w-md w-full mx-4 flex flex-col items-center text-center
    
    sm:transform sm:transition-all sm:duration-300 sm:ease-in-out
    ${isShowing ? 'sm:scale-100 sm:opacity-100' : 'sm:scale-0 sm:opacity-0'}
    ${isClosing ? 'sm:scale-0 sm:opacity-0' : ''}
    
    max-sm:w-full max-sm:m-0 max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:rounded-b-none max-sm:rounded-t-lg max-sm:h-[50vh] max-sm:overflow-auto
    max-sm:transform max-sm:transition-transform max-sm:duration-300 max-sm:ease-in-out
    ${isShowing ? 'max-sm:translate-y-0' : 'max-sm:translate-y-full'}
    ${isClosing ? 'max-sm:translate-y-full' : ''}
  `}
            >
                <div className='w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-4'>
                    <div className='w-24 h-24 relative'>
                        <Image
                            src='/images/success-toast.png'
                            alt='Success'
                            fill
                            className='object-contain'
                        />
                    </div>
                </div>

                <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
                    {title}
                </h2>
                <p className='text-gray-600 mb-6'>{message}</p>

                {labelText && (
                    <p className='text-sm text-gray-400 mb-2'>{labelText}</p>
                )}

                {buttonText && onButtonClick && (
                    <button
                        onClick={handleButtonClick}
                        className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors duration-200'
                    >
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CustomToast;