import { ChangeEvent, FC, useState, KeyboardEvent } from "react";
import { Field, FieldProps, FormikProps } from "formik";
import SvgIcon from "../SvgIcon";
import { hidePasswordIcon } from "@/assets/commonSvg";

interface InputProps {
    type?: "text" | "password" | "email" | "url" | "date" | "number";
    isMultiline?: boolean;
    onChange?: (value: string) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
    name: string;
    disabled?: boolean;
    className?: string;
    acceptNegativeNumber?: boolean;
    currencyOn?: boolean;
    onKeyDown?: (
        event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
}

const Input: FC<InputProps> = ({
    type = "text",
    isMultiline = false,
    label,
    name,
    onChange,
    className = "",
    acceptNegativeNumber = false,
    onKeyDown,
    currencyOn = false,
    ...restProps
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = <T extends object>(
        form: FormikProps<T>,
        value: string
    ): void => {
        // For number type, prevent negative values when acceptNegativeNumber is false
        if (
            type === "number" &&
            !acceptNegativeNumber &&
            value.startsWith("-")
        ) {
            value = value.replace("-", "");
        }

        if (onChange) onChange(value);
        form.setFieldValue(name, value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleKeyDown = (
        event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        // Handle custom keydown first
        if (onKeyDown) {
            onKeyDown(event);
        }

        // For number inputs
        if (type === "number") {
            // Prevent typing minus sign when negative numbers aren't allowed
            if (!acceptNegativeNumber && event.key === "-") {
                event.preventDefault();
                return;
            }

            // Prevent arrow down from making the value negative when not allowed
            if (!acceptNegativeNumber && event.key === "ArrowDown") {
                const currentValue = parseFloat(event.currentTarget.value) || 0;
                if (currentValue <= 0) {
                    event.preventDefault();
                    return;
                }
            }
        }
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
                                            ? "text-red-500"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {label}
                                </label>
                            )}
                            <div className='relative'>
                                {isMultiline ? (
                                    <textarea
                                        id={name}
                                        value={field?.value || ""}
                                        onChange={(event) =>
                                            handleChange(
                                                form,
                                                event.target.value
                                            )
                                        }
                                        onKeyDown={handleKeyDown}
                                        className={`w-full px-4 py-[9px] border rounded-md resize-none overflow-hidden
            focus:outline-none focus:border-2 focus:border-primary focus:border-opacity-70
            ${
                hasError
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300"
            }
            ${
                restProps.disabled
                    ? "bg-[#eff7ff] cursor-not-allowed"
                    : "bg-white"
            }
        `}
                                        rows={1}
                                        onInput={(e) => {
                                            const target = e.currentTarget;
                                            target.style.height = "auto";
                                            target.style.height = `${target.scrollHeight}px`;
                                        }}
                                        {...restProps}
                                    />
                                ) : (
                                    <>
                                        {currencyOn && type === "number" ? (
                                            <div className='relative'>
                                                <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none'>
                                                    NPR |
                                                </div>
                                                <input
                                                    id={name}
                                                    type={type}
                                                    value={field?.value || ""}
                                                    onChange={(event) =>
                                                        handleChange(
                                                            form,
                                                            event.target.value
                                                        )
                                                    }
                                                    onKeyDown={handleKeyDown}
                                                    min={
                                                        type === "number" &&
                                                        !acceptNegativeNumber
                                                            ? 0
                                                            : undefined
                                                    }
                                                    className={`w-full pl-16 pr-4 py-[9px] border rounded-md focus:outline-none focus:border-2 focus:border-primary focus:border-opacity-70
                            ${
                                hasError
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-gray-300"
                            }
                            ${
                                restProps.disabled
                                    ? "bg-[#eff7ff] cursor-not-allowed"
                                    : "bg-white"
                            }
                        `}
                                                    {...restProps}
                                                />
                                            </div>
                                        ) : (
                                            <input
                                                id={name}
                                                type={
                                                    type === "password"
                                                        ? showPassword
                                                            ? "text"
                                                            : "password"
                                                        : type
                                                }
                                                value={field?.value || ""}
                                                onChange={(event) =>
                                                    handleChange(
                                                        form,
                                                        event.target.value
                                                    )
                                                }
                                                onKeyDown={handleKeyDown}
                                                min={
                                                    type === "number" &&
                                                    !acceptNegativeNumber
                                                        ? 0
                                                        : undefined
                                                }
                                                className={`w-full px-4 py-[9px] border rounded-md focus:outline-none focus:border-2 focus:border-primary focus:border-opacity-70
                            ${
                                hasError
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-gray-300"
                            }
                            ${
                                restProps.disabled
                                    ? "bg-[#eff7ff] cursor-not-allowed"
                                    : "bg-white"
                            }
                            ${type === "password" ? "pr-12" : ""}
                        `}
                                                {...restProps}
                                            />
                                        )}
                                    </>
                                )}

                                {type === "password" && (
                                    <button
                                        type='button'
                                        className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'
                                        onClick={togglePasswordVisibility}
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        <SvgIcon src={hidePasswordIcon} />
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
