"use client";

import { Field } from "formik";
import React, { ChangeEvent, FC, useRef } from "react";
import ErrorMessage from "../ui/ErrorMessage";
import CustomImage from "../CustomImage";

interface MultipleUploadProps {
    name: string;
    placeholder?: string;
    onChange?: (value: any) => void;
    label?: string;
    value?: string | any;
    size?: number | null;
    styleLabel?: string;
    className?: string;
    inputClassName?: string;
    maxFiles?: number;
    acceptType?: string;
    varient?: "live" | "local";
}

const MultipleUpload: FC<MultipleUploadProps> = ({
    name,
    label,
    placeholder,
    value,
    size = 100,
    onChange,
    styleLabel = "",
    className = "",
    inputClassName = "",
    maxFiles = 25,
    acceptType = "image/*",
}) => {
    const uploadInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (form: any, files?: FileList) => {
        if (!files || files.length === 0) return;

        const newFiles: Array<any> = [];
        const filesArray = Array.from(files);

        filesArray.forEach((file) => {
            if (!file || !(file instanceof Blob)) return;
            const fileName = file.name;
            const extension = fileName
                .substring(fileName.lastIndexOf(".") + 1)
                .toLowerCase();

            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const base64String = e?.target?.result as string;
                const [info, base64] = base64String.split(",");

                const fileData = {
                    base64: base64.replace(/\s+/g, ""),
                    extension,
                    info,
                    fileName,
                    type: file.type,
                    size: file.size,
                };

                newFiles.push(fileData);

                if (newFiles.length === filesArray.length) {
                    const updatedFiles = [
                        ...(form.values[name] || []),
                        ...newFiles,
                    ];
                    form.setFieldValue(name, updatedFiles);

                    if (onChange) {
                        onChange(updatedFiles);
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    };

    // Only for images, so no need for file/video checks
    const getFileSrc = (file: any) => {
        if (typeof file === "string") return file;
        if (file?.url) return file.url;
        if (file?.base64 && file?.info) return `${file.info},${file.base64}`;
        if (file?.base64 && typeof file.base64 === "string") return file.base64;
        return "";
    };

    return (
        <Field name={name}>
            {({ form, field, meta }: any) => {
                const hasError = meta.touched && meta.error;

                const openFilePicker = () => {
                    uploadInputRef.current?.click();
                };

                const handleFileChange = (
                    event: ChangeEvent<HTMLInputElement>
                ) => {
                    const files = event.target.files;
                    if (files) {
                        handleChange(form, files);
                    }
                    event.target.value = "";
                };

                const existingFiles = Array.isArray(field?.value)
                    ? field.value
                    : [];
                const canAddMore = existingFiles.length < maxFiles;

                return (
                    <div className={`mb-4 ${className}`}>
                        {!!label && (
                            <label
                                className={`block text-sm font-medium mb-1 ${
                                    hasError ? "text-red-500" : "text-gray-700"
                                } ${styleLabel}`}
                            >
                                {label}
                            </label>
                        )}

                        <input
                            type='file'
                            ref={uploadInputRef}
                            onChange={handleFileChange}
                            className='hidden'
                            multiple
                            accept={acceptType}
                        />

                        <div className='w-full'>
                            <div className='grid grid-cols-6 gap-3 mb-3'>
                                {existingFiles.map(
                                    (file: any, index: number) => {
                                        const src = getFileSrc(file);
                                        const fileName =
                                            file?.fileName ||
                                            file?.name ||
                                            (typeof file === "string"
                                                ? file.split("/").pop()
                                                : "Unknown file");

                                        // Determine variant: 'live' for string (existing), 'local' for base64/object
                                        let variantType: "live" | "local" =
                                            "local";
                                        if (
                                            typeof src === "string" &&
                                            (src.startsWith("uploads/") ||
                                                src.startsWith(
                                                    `${process.env.NEXT_PUBLIC_BUCKET_URL}`
                                                ))
                                        ) {
                                            variantType = "live";
                                        } else if (
                                            typeof src === "string" &&
                                            (src.startsWith("data:") ||
                                                /^[A-Za-z0-9+/=]{100,}/.test(
                                                    src
                                                ))
                                        ) {
                                            variantType = "local";
                                        }

                                        return (
                                            <div
                                                key={`file-${index}`}
                                                className='relative aspect-video border border-gray-200 rounded-md overflow-hidden'
                                            >
                                                {src && (
                                                    <CustomImage
                                                        src={src}
                                                        alt={fileName}
                                                        variant={variantType}
                                                        fit='contain'
                                                        className='aspect-video'
                                                    />
                                                )}
                                                <button
                                                    type='button'
                                                    className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const updatedFiles = [
                                                            ...existingFiles,
                                                        ];
                                                        updatedFiles.splice(
                                                            index,
                                                            1
                                                        );
                                                        form.setFieldValue(
                                                            name,
                                                            updatedFiles
                                                        );
                                                        if (onChange) {
                                                            onChange(
                                                                updatedFiles
                                                            );
                                                        }
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        );
                                    }
                                )}
                            </div>

                            {canAddMore && (
                                <div
                                    onClick={openFilePicker}
                                    className={`w-full bg-white flex items-center justify-center cursor-pointer overflow-hidden rounded-md border-2 border-dashed ${
                                        hasError
                                            ? "border-red-500"
                                            : "border-gray-500"
                                    }`}
                                    style={{ height: `${size}px` }}
                                >
                                    <div className='flex flex-col items-center gap-2'>
                                        <p className='text-sm text-gray-400'>
                                            {existingFiles.length > 0
                                                ? `Add more images (${existingFiles.length}/${maxFiles})`
                                                : placeholder ||
                                                  "Upload images"}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {!!hasError && <ErrorMessage message={meta.error} />}
                    </div>
                );
            }}
        </Field>
    );
};

export default MultipleUpload;
