"use client";

import {
    useRef,
    useState,
    useEffect,
    Fragment,
    ChangeEvent,
    KeyboardEvent,
} from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";

interface OtpInputProps {
    length?: number;
    name: string;
    onChange?: (value: string) => void;
    onResend?: () => void;
    className?: string;
}

const OtpInput = ({
    name,
    length = 6,
    onChange,
    onResend,
    className,
}: OtpInputProps) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
    const [timeLeft, setTimeLeft] = useState(120);
    const formik = useFormikContext();

    const handleChange = ({
        value,
        index,
    }: {
        value: string;
        index: number;
    }) => {
        // Only take the last character if multiple digits are pasted/entered
        const sanitizedValue = value.slice(-1);
        const newOtp = [...otp];
        newOtp[index] = sanitizedValue;
        const updatedOtp = newOtp.join("");

        setOtp(newOtp);

        if (sanitizedValue && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        formik.setFieldValue(name, updatedOtp);
        if (onChange) {
            onChange(updatedOtp);
        }
    };

    const handleKeyDown = ({ key, index }: { key: string; index: number }) => {
        if (key === "Backspace") {
            const newOtp = [...otp];

            if (!newOtp[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }

            newOtp[index] = "";
            const updatedOtp = newOtp.join("");

            setOtp(newOtp);
            formik.setFieldValue(name, updatedOtp);
            if (onChange) {
                onChange(updatedOtp);
            }
        }
    };

    const restartTimer = () => {
        if (onResend) {
            onResend();
        }
        setTimeLeft(120);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        if (timeLeft <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer); // Cleanup on unmount
    }, [timeLeft]);

    return (
        <Field name={name} className={className}>
            {({ meta }: { meta: { touched: boolean; error?: string } }) => {
                const hasError = meta.touched && meta.error;

                return (
                    <>
                        <div className='flex gap-2 justify-center mb-4'>
                            {otp.map((value, index) => (
                                <Fragment key={index}>
                                    <input
                                        type='number'
                                        inputMode='numeric'
                                        maxLength={1}
                                        value={value}
                                        ref={(el) => {
                                            inputRefs.current[index] = el;
                                        }}
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) =>
                                            handleChange({
                                                value: e.target.value,
                                                index,
                                            })
                                        }
                                        onKeyDown={(
                                            e: KeyboardEvent<HTMLInputElement>
                                        ) =>
                                            handleKeyDown({ key: e.key, index })
                                        }
                                        className='w-12 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                                    />
                                </Fragment>
                            ))}
                        </div>

                        <div className='flex items-center justify-center gap-1 text-sm mt-2'>
                            <span className='text-gray-600'>
                                Didn&apos;t receive OTP.
                            </span>
                            <button
                                type='button'
                                onClick={restartTimer}
                                className='text-primary font-medium hover:text-blue-800'
                            >
                                Resend it in
                            </button>
                            <span className='text-gray-600'>
                                {formatTime(timeLeft)}
                            </span>
                        </div>

                        {hasError && (
                            <div className='text-red-500 text-sm mt-1'>
                                <ErrorMessage name={name} />
                            </div>
                        )}
                    </>
                );
            }}
        </Field>
    );
};

export default OtpInput;
