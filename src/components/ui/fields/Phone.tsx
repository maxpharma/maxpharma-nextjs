import { ChangeEvent, FC } from 'react';
import { Field, FieldProps } from 'formik';
import Image from 'next/image';

interface PhoneInputProps {
    label?: string;
    name: string;
    onChange?: (value: any) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

const PhoneInput: FC<PhoneInputProps> = ({
    label = 'Phone',
    name,
    onChange,
    placeholder = 'Enter your phone number',
    className = '',
    disabled = false,
}) => {
    return (
        <div className={className}>
            <Field name={name}>
                {({ field, meta, form }: FieldProps) => {
                    const hasError = meta.touched && meta.error;
                    console.log('meta', meta);
                    console.log('field', field);

                    const handlePhoneChange = (
                        e: ChangeEvent<HTMLInputElement>
                    ) => {
                        const rawValue = e.target.value;
                        const sanitizedValue = rawValue
                            .replace(/\D/g, '')
                            .slice(0, 10);

                        form.setFieldValue(name, sanitizedValue);

                        if (onChange) {
                            onChange({
                                target: { name, value: sanitizedValue },
                            });
                        }
                    };

                    return (
                        <div className='mb-4'>
                            {label && (
                                <label
                                    htmlFor={name}
                                    className={`block text-sm font-medium mb-1 ${
                                        hasError
                                            ? 'text-red-500'
                                            : 'text-gray-700'
                                    }`}
                                >
                                    {label}
                                </label>
                            )}
                            <div
                                className={`relative bg-white flex items-center border rounded-md overflow-hidden focus-within:border focus-within:border-black focus-within:border-opacity-70 ${
                                    hasError
                                        ? 'border-red-500 focus-within:border-red-500'
                                        : 'border-gray-300'
                                }`}
                            >
                                {/* Nepal Flag + Country Code */}
                                <div className='flex items-center pl-3 py-2'>
                                    <div className='relative w-6 h-4 mr-1'>
                                        <Image
                                            src={'/images/nepal-icon.png'}
                                            alt='nepal-flag'
                                            fill
                                            className='object-contain'
                                        />
                                    </div>
                                    <span className='text-gray-600 text-sm'>
                                        +977
                                    </span>
                                </div>

                                <input
                                    id={name}
                                    type='tel'
                                    value={field.value || ''}
                                    onChange={handlePhoneChange}
                                    onBlur={field.onBlur}
                                    disabled={disabled}
                                    placeholder={placeholder}
                                    className={`w-full px-3 py-2 focus:outline-none bg-white
                                     ${
                                         disabled
                                             ? 'bg-gray-100 cursor-not-allowed'
                                             : ''
                                     }`}
                                />
                            </div>
                            {hasError && (
                                <p className='mt-1 text-sm text-red-500'>
                                    {meta.error}
                                </p>
                            )}
                        </div>
                    );
                }}
            </Field>
        </div>
    );
};

export default PhoneInput;
