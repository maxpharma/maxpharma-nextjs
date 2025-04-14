'use client';

import React from 'react';
import { ErrorMessage as FormikErrorMessage } from 'formik';

interface ErrorMessageProps {
    name: string;
    className?: string;
    component?: React.ElementType;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
    name,
    className = '',
    component,
}) => {
    return (
        <FormikErrorMessage
            name={name}
            render={(message) => (
                <div
                    className={`text-red-500 text-sm mt-1 font-medium ${className}`}
                >
                    {message}
                </div>
            )}
            component={component}
        />
    );
};

export default ErrorMessage;
