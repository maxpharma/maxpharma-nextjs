import { Constant } from ".";
import uploadImage from "./uploadImage";
import { uploadToSpaces } from "./s3";
import env from "../config/env";

const getMimeType = (extension: string) => {
  switch (extension.toLowerCase()) {
    case "pdf":
      return "application/pdf";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "doc":
      return "application/msword";
    case "mp4":
      return "video/mp4";
    case "mkv":
      return "video/x-matroska";
    case "mov":
      return "video/quicktime";
    case "webp":
      return "image/webp";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    default:
      return "application/octet-stream";
  }
};

const uploadFile = async ({
  filePath,
  fileName,
  base64,
}: {
  filePath: string;
  fileName: string;
  base64: string;
}) => {
  try {
    const extension = (fileName.split(".").pop() || "").toLowerCase();

    // If it is an image, convert to webp and upload via uploadImage
    if (Constant.imageValidationExtensions.includes(extension)) {
      return await uploadImage({
        filePath,
        fileName,
        base64,
      });
    }

    // Otherwise, upload directly to DigitalOcean Spaces
    const cleanBase64 = base64.includes(",") ? base64.split(",")[1] : base64;
    const buffer = Buffer.from(cleanBase64, "base64");
    const folderPrefix = env.DIGITAL_BUCKET_FOLDER || "maxpharma";
    const spaceKey = `${folderPrefix}/${filePath}/${fileName}`;

    await uploadToSpaces({
      key: spaceKey,
      buffer,
      contentType: getMimeType(extension),
    });

    console.log(`[Spaces Upload File] Successfully uploaded: ${spaceKey}`);
    return spaceKey;
  } catch (err: any) {
    console.error("Error in uploadFile:", err);
    throw new Error(err?.message || err);
  }
};

export default uploadFile;