import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SmoothDropdownProps {
    label: string;
    options: string[];
    placeholder?: string;
    onChange?: (selectedOption: string) => void;
    value?: string; // Add value prop for controlled behavior
    className?: string;
}

const Dropdown: React.FC<SmoothDropdownProps> = ({
    label,
    options,
    placeholder = "Select",
    onChange,
    value,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Sync internal selectedOption with external value
    useEffect(() => {
        if (value !== undefined) {
            setSelectedOption(value);
        }
    }, [value]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectOption = (option: string) => {
        setSelectedOption(option);
        setIsOpen(false);
        if (onChange) {
            onChange(option);
        }
    };

    return (
        <div className={`${className}`}>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
                {label}
            </label>
            <div className='relative' ref={dropdownRef}>
                <button
                    type='button'
                    className='flex items-center justify-between w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                    onClick={toggleDropdown}
                >
                    <span
                        className={`text-gray-700 ${
                            !selectedOption ? "text-gray-500" : ""
                        }`}
                    >
                        {selectedOption || placeholder}
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
                            onClick={() => selectOption(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dropdown;
