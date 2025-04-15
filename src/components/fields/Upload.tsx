"use client";

import { Field } from "formik";
import React, { ChangeEvent, FC, useRef, useState } from "react";
import Image from "next/image";
import ErrorMessage from "../ui/ErrorMessage";
import SvgIcon from "../SvgIcon";
import {
  galleryCardIcon,
  profileImageIcon,
  smallProfileImageIcon,
} from "@/assets/commonSvg";

// Note: You'll provide the SvgIcon component yourself

interface UploadProps {
  variant?: "dashed" | "drag" | "input" | "multiple" | "galleryCard";
  name: string;
  placeholder?: string;
  onChange?: (value: any) => void;
  label?: string;
  value?: string | any;
  size?: number | null;
  styleLabel?: string;
  className?: string;
  maxFiles?: number;
  acceptFiles?: boolean;
  acceptType?: string;
  cardIcon?: "profile" | "galleryCard" | boolean;
  type?: "image" | "video" | "all"; // Add this new prop
}

const Upload: FC<UploadProps> = ({
  variant = "dashed",
  name,
  label,
  placeholder,
  value,
  size = 100,
  onChange,
  styleLabel = "",
  className = "",
  maxFiles = 25,
  acceptFiles = false,
  acceptType = "",
  cardIcon = false,
  type = "image", // Default to image for backward compatibility
}) => {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [previewImages, setPreviewImages] = useState<Array<any>>([]);

  const handleChange = (form: any, files?: FileList) => {
    if (!files || files.length === 0) return;

    if (variant === "multiple") {
      const newFiles: Array<any> = [];
      const filesArray = Array.from(files);

      filesArray.forEach((file) => {
        if (!file || !(file instanceof Blob)) {
          console.error("Invalid file object:", file);
          return; // Skip this file
        }
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
            type: file.type, // Store the file type
            size: file.size,
          };

          newFiles.push(fileData);

          if (newFiles.length === filesArray.length) {
            const updatedFiles = [...(form.values[name] || []), ...newFiles];
            form.setFieldValue(name, updatedFiles);
            setPreviewImages(updatedFiles);

            if (onChange) {
              onChange(updatedFiles);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      const file = files[0];

      if (!file || !(file instanceof Blob)) {
        console.error("Invalid file object:", file);
        return; // Skip processing
      }

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
          type: file.type, // Store the file type
          size: file.size, // Store the file size
        };

        form.setFieldValue(name, fileData);

        if (onChange) {
          onChange(fileData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (form: any, index: number) => {
    const updatedFiles = [...form.values[name]];
    updatedFiles.splice(index, 1);
    form.setFieldValue(name, updatedFiles);
    setPreviewImages(updatedFiles);

    if (onChange) {
      onChange(updatedFiles);
    }
  };

  // Function to determine file type (image or video)
  const isImageFile = (fileType: string) => {
    return fileType.startsWith("image/");
  };

  const isVideoFile = (fileType: string) => {
    return fileType.startsWith("video/");
  };

  const isMediaFile = (fileType: string) => {
    return isImageFile(fileType) || isVideoFile(fileType);
  };

  // Function to get file icon based on extension
  const getFileIcon = (extension: string) => {
    // You can customize this based on different file types
    switch (extension) {
      case "pdf":
        return "📄"; // PDF icon (you'll replace this with your SVG icon)
      case "doc":
      case "docx":
        return "📝"; // Word icon
      case "xls":
      case "xlsx":
        return "📊"; // Excel icon
      case "ppt":
      case "pptx":
        return "📑"; // PowerPoint icon
      case "zip":
      case "rar":
        return "🗜️"; // Archive icon
      default:
        return "📎"; // Default file icon
    }
  };

  // Function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderCardIcon = () => {
    switch (cardIcon) {
      case "galleryCard":
        return (
          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center mb-2">
            <span className="text-gray-400 text-2xl">
              <SvgIcon src={galleryCardIcon} />
            </span>
          </div>
        );
      case "profile":
        return (
          <div className="size-24 rounded-full bg-blue-400 flex items-center justify-center">
            <SvgIcon src={profileImageIcon} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Field name={name}>
      {({ form, field, meta }: any) => {
        const hasError = meta.touched && meta.error;

        const openFilePicker = () => {
          uploadInputRef.current?.click();
        };

        const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
          const files = event.target.files;
          if (files) {
            handleChange(form, files);
          }
          event.target.value = "";
        };

        const fileValue = field?.value;
        const isMultiple = variant === "multiple";
        const existingFiles = isMultiple ? fileValue || [] : [];
        const canAddMore = isMultiple ? existingFiles.length < maxFiles : true;

        // Determine accept attribute value
        let acceptAttr = acceptType;
        if (!acceptFiles) {
          if (type === "video") {
            acceptAttr = "video/*";
          } else if (type === "all") {
            acceptAttr = "image/*,video/*";
          } else {
            acceptAttr = "image/*"; // Default to image/*
          }
        } else if (!acceptType) {
          acceptAttr = "*/*"; // Accept all files if acceptFiles is true but no specific type is provided
        }

        return (
          <div className={` mb-4 ${className}`}>
            {!!label && variant !== "drag" && variant !== "galleryCard" && (
              <label
                className={`block text-sm font-medium mb-1 ${
                  hasError ? "text-red-500" : "text-gray-700"
                } ${styleLabel}`}
              >
                {label}
              </label>
            )}

            <input
              type="file"
              ref={uploadInputRef}
              onChange={handleFileChange}
              className="hidden "
              multiple={isMultiple}
              accept={acceptAttr}
            />

            {variant === "dashed" && (
              <div
                onClick={openFilePicker}
                className={`w-full bg-white flex items-center justify-center cursor-pointer overflow-hidden rounded-md border-2 border-dashed ${
                  hasError ? "border-red-500" : "border-gray-500"
                }`}
                style={{ height: `${size}px` }}
              >
                {fileValue?.base64 ? (
                  isImageFile(fileValue.type || "") ? (
                    <div className="w-full h-full relative">
                      <Image
                        src={`${fileValue.info},${fileValue.base64}`}
                        alt="Uploaded file"
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  ) : isVideoFile(fileValue.type || "") ? (
                    <div className="w-full h-full relative">
                      <video
                        controls
                        className="w-full h-full object-contain"
                        src={`${fileValue.info},${fileValue.base64}`}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="text-3xl">
                        {getFileIcon(fileValue.extension)}
                      </div>
                      <p className="text-sm text-gray-700">
                        {fileValue.fileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(fileValue.size || 0)}
                      </p>
                    </div>
                  )
                ) : value ? (
                  <div className="w-full h-full relative">
                    <Image
                      src={value}
                      alt="Preview"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {/* You'll add your SvgIcon here */}
                    {/* <SvgIcon icon={UploadIcon} className="text-gray-300" /> */}
                    <p className="text-sm text-gray-400">
                      {placeholder ||
                        (acceptFiles ? "Upload file" : "Upload image")}
                    </p>
                  </div>
                )}
              </div>
            )}

            {variant === "galleryCard" && (
              <div
                onClick={openFilePicker}
                className={`${
                  cardIcon !== "profile"
                    ? "relative flex flex-col items-center justify-center cursor-pointer overflow-hidden rounded-md bg-gray-100"
                    : "relative cursor-pointer" // Simplified for profile variant
                } ${className}`}
              >
                {fileValue?.base64 ? (
                  isImageFile(fileValue.type || "") ? (
                    <div className="w-full h-full relative">
                      <Image
                        src={`${fileValue.info},${fileValue.base64}`}
                        alt="Uploaded file"
                        layout="fill"
                        objectFit="cover"
                        className={cardIcon === "profile" ? "rounded-full" : ""}
                      />
                    </div>
                  ) : isVideoFile(fileValue.type || "") ? (
                    <div className="w-full h-full relative">
                      <video
                        controls
                        className="w-full h-full object-contain"
                        src={`${fileValue.info},${fileValue.base64}`}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 p-4">
                      <div className="text-3xl">
                        {getFileIcon(fileValue.extension)}
                      </div>
                      <p className="text-sm text-gray-700">
                        {fileValue.fileName}
                      </p>
                    </div>
                  )
                ) : value ? (
                  <div className="w-full h-full relative">
                    <Image
                      src={value}
                      alt="Preview"
                      layout="fill"
                      objectFit="cover"
                      className={cardIcon === "profile" ? "rounded-full" : ""}
                    />
                  </div>
                ) : (
                  <div className="relative flex flex-col items-center justify-center p-4">
                    {cardIcon && renderCardIcon()}

                    {placeholder && (
                      <p className="text-sm whitespace-nowrap text-gray-500 text-center">
                        {placeholder}
                      </p>
                    )}
                  </div>
                )}
                <div
                  className={`${
                    cardIcon === "profile" ? "" : "hidden"
                  } absolute z-50 bottom-0 right-0 p-1 rounded-full flex items-center justify-center bg-white text-primary`}
                >
                  <SvgIcon src={smallProfileImageIcon} />
                </div>
              </div>
            )}

            {variant === "multiple" && (
              <div className="w-full">
                {/* Grid to display uploaded files */}
                <div className="grid grid-cols-6 gap-3 mb-3">
                  {/* Show newly uploaded files */}
                  {existingFiles.map((file: any, index: number) => (
                    <div
                      key={`new-${index}`}
                      className="relative aspect-video border border-gray-200 rounded-md overflow-hidden"
                    >
                      {isImageFile(file.type || "") ? (
                        <Image
                          src={`${file.info},${file.base64}`}
                          alt={`File ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : isVideoFile(file.type || "") ? (
                        <video
                          controls
                          className="w-full h-full object-contain"
                          src={`${file.info},${file.base64}`}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-2">
                          <div className="text-2xl mb-1">
                            {getFileIcon(file.extension)}
                          </div>
                          <p className="text-xs text-gray-700 truncate w-full text-center">
                            {file.fileName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatFileSize(file.size || 0)}
                          </p>
                        </div>
                      )}
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(form, index);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* Show pre-existing files */}
                  {Array.isArray(value) &&
                    value.map((file: any, index: number) => (
                      <div
                        key={`existing-${index}`}
                        className="relative aspect-video border border-gray-200 rounded-md overflow-hidden"
                      >
                        {typeof file === "string" ? (
                          <Image
                            src={file}
                            alt={`File ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                          />
                        ) : file.url ? (
                          <Image
                            src={file.url}
                            alt={`File ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-2">
                            <div className="text-2xl mb-1">📎</div>
                            <p className="text-xs text-gray-700 truncate w-full text-center">
                              {file.fileName || "Unknown file"}
                            </p>
                          </div>
                        )}
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle removing pre-existing files
                            if (onChange) {
                              const newValue = [...value];
                              newValue.splice(index, 1);
                              onChange(newValue);
                            }
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                </div>

                {/* Upload button */}
                {canAddMore && (
                  <div
                    onClick={openFilePicker}
                    className={`w-full flex items-center justify-center cursor-pointer overflow-hidden rounded-md border-2 border-dashed ${
                      hasError ? "border-red-500" : "border-gray-500"
                    }`}
                    style={{ height: `${size}px` }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm text-gray-400">
                        {existingFiles.length > 0 ||
                        (Array.isArray(value) && value.length > 0)
                          ? `Add more ${acceptFiles ? "files" : "images"} (${
                              existingFiles.length +
                              (Array.isArray(value) ? value.length : 0)
                            }/${maxFiles})`
                          : placeholder ||
                            (acceptFiles ? "Upload files" : "Upload images")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {variant === "drag" && (
              <div
                className={`border-2 border-dashed w-full p-6 rounded-md ${
                  hasError ? "border-red-500" : "border-gray-300"
                } flex flex-col items-center justify-center cursor-pointer`}
                onClick={openFilePicker}
              >
                {/* You'll add your SvgIcon here */}
                {/* <SvgIcon icon={UploadIcon} className="text-gray-300" /> */}
                <p className="text-sm text-gray-500 mt-2">
                  {placeholder ||
                    `Drag and drop ${
                      acceptFiles ? "files" : "images"
                    } here or click to upload`}
                </p>
                {fileValue?.base64 && (
                  <div className="mt-4 w-full max-w-xs overflow-hidden">
                    <div className="bg-gray-100 p-2 rounded-md">
                      <div className="flex items-center gap-2">
                        <span>{getFileIcon(fileValue.extension)}</span>
                        <p className="text-xs text-gray-700 truncate">
                          {fileValue.fileName}
                        </p>
                        <p className="text-xs text-gray-500 ml-auto">
                          {formatFileSize(fileValue.size || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {variant === "input" && (
              <div
                className="flex items-center justify-between w-full border border-gray-300 rounded-md px-2 py-3 cursor-pointer"
                onClick={openFilePicker}
              >
                <p className="text-xs text-gray-400 truncate">
                  {field?.value?.fileName ||
                    (value
                      ? typeof value === "string"
                        ? value.split("/").pop()
                        : value.fileName
                      : placeholder ||
                        `Select a ${acceptFiles ? "file" : "image"}`)}
                </p>
              </div>
            )}
            {!!hasError && <ErrorMessage message={meta.error} />}
          </div>
        );
      }}
    </Field>
  );
};

export default Upload;
