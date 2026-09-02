import path from "path";
import fs from "fs";
import { ROOT_PATH } from "../constant";
import { deleteFromSpaces } from "./s3";

const removeFile = async ({ filePath }: { filePath: string }) => {
  try {
    if (!filePath) return filePath;

    // Delete from DigitalOcean Spaces
    await deleteFromSpaces({ key: filePath });

    // Also attempt to delete from local uploads if a local copy exists
    try {
      const localPath = path.join(ROOT_PATH, "../", filePath);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
    } catch {
      // Local removal is secondary/best-effort
    }

    return filePath;
  } catch (err: any) {
    console.error("Error in removeFile:", err);
    return filePath;
  }
};

export default removeFile;