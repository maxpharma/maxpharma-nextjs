import { deleteFromSpaces } from "./s3";

const removeFile = async ({ filePath }: { filePath: string }) => {
  try {
    if (!filePath) return filePath;

    // Delete from DigitalOcean Spaces
    await deleteFromSpaces({ key: filePath });

    return filePath;
  } catch (err: any) {
    console.error("Error in removeFile:", err);
    return filePath;
  }
};

export default removeFile;