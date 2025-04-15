import { ChangeEvent, FC } from "react";
import { Field, FieldProps, FormikProps } from "formik";

interface TextAreaProps {
    onChange?: (value: string) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
    name: string;
    disabled?: boolean;
    rows?: number;
    className?: string;
}

const TextArea: FC<TextAreaProps> = ({
    label,
    name,
    onChange,
    rows = 4,
    ...restProps
}) => {
    const handleChange = (form: FormikProps<unknown>, value: string): void => {
        if (onChange) onChange(value);
        form.setFieldValue(name, value);
    };

    return (
        <Field name={name}>
            {({ field, meta, form }: FieldProps<unknown>) => {
                const hasError = meta.touched && meta.error;

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
                        <textarea
                            id={name}
                            value={String(field.value ?? "")}
                            rows={rows}
                            onChange={(
                                event: ChangeEvent<HTMLTextAreaElement>
                            ) => handleChange(form, event.target.value)}
                            onInput={(e) => {
                                const target = e.currentTarget;
                                target.style.height = "auto"; // Reset height
                                target.style.height = `${target.scrollHeight}px`; // Set new height
                            }}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:border-2 focus:border-primary focus:border-opacity-70
                ${
                    hasError
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300"
                } 
                ${
                    restProps.disabled
                        ? "bg-gray-100 cursor-not-allowed"
                        : "bg-white"
                }
              `}
                            {...restProps}
                        />
                        {!!hasError && (
                            <p className='mt-1 text-sm text-red-500'>
                                {meta.error}
                            </p>
                        )}
                    </div>
                );
            }}
        </Field>
    );
};

export default TextArea;
