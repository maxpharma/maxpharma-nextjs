import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import uploadFile from "@/server/utils/uploadFile";

export const POST = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const body = await request.json();
  const { filePath, fileName, base64 } = body || {};
  if (!filePath || !fileName || !base64) {
    throw new Error("Invalid Request.");
  }
  const key = await uploadFile({ filePath, fileName, base64 });
  return { key };
});
