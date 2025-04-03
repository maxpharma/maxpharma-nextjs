import { ChangeEvent, FC, useState } from 'react';
import { Field, FieldProps, FormikProps } from 'formik';
import SvgIcon from '../svg';

interface InputProps {
    type?: 'text' | 'password' | 'email' | 'url' | 'date';
    onChange?: (value: string) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
    name: string;
    disabled?: boolean;
    className?: string;
}

const Input: FC<InputProps> = ({
    type = 'text',
    label,
    name,
    onChange,
    className = '',
    ...restProps
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = <T extends object>(
        form: FormikProps<T>,
        value: string
    ): void => {
        if (onChange) onChange(value);
        form.setFieldValue(name, value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={className}>
            <Field name={name}>
                {({ field, meta, form }: FieldProps) => {
                    const hasError = meta.touched && meta.error;

                    return (
                        <div className='mb-4'>
                            {!!label && (
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
                            <div className='relative'>
                                <input
                                    id={name}
                                    type={
                                        type === 'password'
                                            ? showPassword
                                                ? 'text'
                                                : 'password'
                                            : type
                                    }
                                    value={field?.value || ''}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>
                                    ) => {
                                        handleChange(form, event.target.value);
                                    }}
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-1 focus:border-black focus:border-opacity-70
                                    ${
                                        hasError
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-300'
                                    } 
                                    ${
                                        restProps.disabled
                                            ? 'bg-gray-100 cursor-not-allowed'
                                            : 'bg-white'
                                    }
                                    ${type === 'password' ? 'pr-12' : ''}
                                    `}
                                    {...restProps}
                                />
                                {type === 'password' && (
                                    <button
                                        type='button'
                                        className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'
                                        onClick={togglePasswordVisibility}
                                        aria-label={
                                            showPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                    >
                                        <SvgIcon
                                            pathname={
                                                showPassword
                                                    ? '/svg/eye-close.svg'
                                                    : '/svg/eye-open.svg'
                                            }
                                            className='w-5 h-5 text-gray-500'
                                            width={20}
                                            height={20}
                                        />
                                    </button>
                                )}
                            </div>
                            {!!hasError && (
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

export default Input;
