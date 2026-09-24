import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import AdminService from "@/server/modules/admins/service";

export const GET = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const { searchParams } = new URL(request.url);
  return AdminService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  });
});
