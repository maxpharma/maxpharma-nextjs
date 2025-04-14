"use client";

import React from "react";
import { Field, FieldProps } from "formik";

interface SimpleCheckboxProps {
    name: string;
    className?: string;
    label?: string;
    disabled?: boolean;
}

const Checkbox: React.FC<SimpleCheckboxProps> = ({
    name,
    className = "",
    label,
    disabled = false,
}) => {
    return (
        <Field name={name} type='checkbox'>
            {({ field, form }: FieldProps) => (
                <input
                    type='checkbox'
                    id={name}
                    name={name}
                    aria-label={label}
                    checked={field.value === true}
                    onChange={(e) => {
                        // Explicitly set boolean true/false value
                        form.setFieldValue(name, e.target.checked);
                    }}
                    onBlur={field.onBlur}
                    disabled={disabled}
                    className={`
            h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            ${className}
          `}
                />
            )}
        </Field>
    );
};

export default Checkbox;
