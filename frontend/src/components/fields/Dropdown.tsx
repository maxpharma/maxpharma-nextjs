import { FC, useRef, useState, useEffect } from "react";
import { Field, FieldProps } from "formik";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
    label: string;
    options: string[];
    placeholder?: string;
    name: string;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    className?: string;
}

const Dropdown: FC<DropdownProps> = ({
    label,
    options,
    placeholder = "Select",
    name,
    value,
    onChange,
    disabled = false,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // For non-Formik usage, manage local value
    const [localValue, setLocalValue] = useState<string>("");

    useEffect(() => {
        if (value !== undefined) setLocalValue(value);
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    // Handles both Formik and non-Formik
    const handleChange = (form: any, selected: string) => {
        if (form && form.setFieldValue) {
            if (onChange) onChange(selected);
            form.setFieldValue(name, selected);
        } else {
            setLocalValue(selected);
            if (onChange) onChange(selected);
        }
        setIsOpen(false);
    };

    // If used inside Formik, Field will provide form/field/meta
    // If not, just render a controlled dropdown
    const renderDropdown = (field?: any, meta?: any, form?: any) => {
        const hasError = meta && meta.touched && meta.error;
        const currentValue =
            field && field.value !== undefined
                ? field.value
                : value !== undefined
                ? value
                : localValue;

        return (
            <div className='mb-4'>
                {!!label && (
                    <label
                        htmlFor={name}
                        className={`block text-sm font-medium mb-1 ${
                            hasError ? "text-red-500" : "text-gray-700"
                        }`}
                    >
                        {label}
                    </label>
                )}
                <div className='relative' ref={dropdownRef}>
                    <button
                        type='button'
                        id={name}
                        className={`flex items-center justify-between w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50
                        ${
                            hasError
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                        }
                        ${
                            disabled
                                ? "bg-gray-100 cursor-not-allowed opacity-70"
                                : "cursor-pointer"
                        }`}
                        onClick={toggleDropdown}
                        disabled={disabled}
                    >
                        <span
                            className={`${
                                !currentValue
                                    ? "text-gray-500"
                                    : "text-gray-700"
                            }`}
                        >
                            {currentValue || placeholder}
                        </span>
                        <ChevronDown
                            className={`w-5 h-5 transition-transform duration-300 ${
                                isOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    <div
                        className={`absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 transition-all duration-300 ease-in-out overflow-hidden ${
                            isOpen
                                ? "max-h-96 opacity-100"
                                : "max-h-0 opacity-0 pointer-events-none"
                        }`}
                    >
                        {options.map((option, index) => (
                            <div
                                key={index}
                                className='px-4 py-3 text-gray-700 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150'
                                onClick={() => handleChange(form, option)}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
                {!!hasError && (
                    <p className='mt-1 text-sm text-red-500'>{meta.error}</p>
                )}
            </div>
        );
    };

    return typeof Field === "function" ? (
        <Field name={name}>
            {({ field, meta, form }: FieldProps) =>
                renderDropdown(field, meta, form)
            }
        </Field>
    ) : (
        renderDropdown()
    );
};

export default Dropdown;
