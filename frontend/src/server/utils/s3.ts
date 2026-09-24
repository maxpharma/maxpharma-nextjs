import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import env from "../config/env";

let _s3Client: S3Client | null = null;

const getS3Client = (): S3Client => {
  if (_s3Client) return _s3Client;
  _s3Client = new S3Client({
    endpoint: env.DIGITAL_ENDPOINT,
    region: "blr1",
    credentials: {
      accessKeyId: env.DIGITAL_ACCESS_ID,
      secretAccessKey: env.DIGITAL_SECRET_KEY,
    },
  });
  return _s3Client;
};

export const uploadToSpaces = async ({
  key,
  buffer,
  contentType,
}: {
  key: string;
  buffer: Buffer;
  contentType: string;
}) => {
  try {
    const cleanKey = key.replace(/^\/+/, "");
    const command = new PutObjectCommand({
      Bucket: env.DIGITAL_BUCKET_NAME,
      Key: cleanKey,
      Body: buffer,
      ACL: "public-read",
      ContentType: contentType,
    });

    await getS3Client().send(command);
    return cleanKey;
  } catch (error: any) {
    console.error("Error uploading to DigitalOcean Spaces:", error);
    throw new Error(
      `Failed to upload to DigitalOcean Spaces: ${error?.message || error}`,
    );
  }
};

export const deleteFromSpaces = async ({ key }: { key: string }) => {
  try {
    if (!key) return;
    const cleanKey = key.replace(/^\/+/, "");
    const command = new DeleteObjectCommand({
      Bucket: env.DIGITAL_BUCKET_NAME,
      Key: cleanKey,
    });

    await getS3Client().send(command);
    return cleanKey;
  } catch (error: any) {
    console.error("Error deleting from DigitalOcean Spaces:", error);
    // Non-blocking error for delete
  }
};

export { getS3Client };
export default getS3Client;
