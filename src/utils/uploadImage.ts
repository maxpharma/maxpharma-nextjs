import sharp from "sharp";
import heicConvert from "heic-convert";
import env from "../config/env";
import { uploadToSpaces } from "./s3";

const uploadImage = async ({
  filePath,
  fileName,
  base64,
}: {
  filePath: string;
  fileName: string;
  base64: string;
}) => {
  try {
    // Strip possible data URI scheme prefix (e.g. data:image/png;base64,...)
    const cleanBase64 = base64.includes(",") ? base64.split(",")[1] : base64;
    const buffer = Buffer.from(cleanBase64, "base64");

    // Extract base name without extension
    const name = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
    const extension = (fileName.split(".").pop() || "").toLowerCase();

    let webpBuffer: Buffer;

    if (extension === "heic" || extension === "heif") {
      try {
        webpBuffer = await sharp(buffer)
          .webp({ quality: 85 })
          .toBuffer();
      } catch {
        const pngBuffer: any = await heicConvert({
          buffer: buffer as any,
          format: "PNG",
          quality: 0.9,
        });
        webpBuffer = await sharp(pngBuffer)
          .webp({ quality: 85 })
          .toBuffer();
      }
    } else {
      webpBuffer = await sharp(buffer)
        .webp({ quality: 85 })
        .toBuffer();
    }

    const webpFileName = `${name}.webp`;
    const folderPrefix = env.DIGITAL_BUCKET_FOLDER || "maxpharma";
    const spaceKey = `${folderPrefix}/${filePath}/${webpFileName}`;

    await uploadToSpaces({
      key: spaceKey,
      buffer: webpBuffer,
      contentType: "image/webp",
    });

    console.log(`[Spaces Upload] Successfully uploaded: ${spaceKey}`);
    return spaceKey;
  } catch (err: any) {
    console.error("Error in uploadImage:", err);
    throw new Error(err?.message || err);
  }
};

export default uploadImage;