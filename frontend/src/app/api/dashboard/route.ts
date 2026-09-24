import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import DashboardService from "@/server/modules/dashboard/service";

export const GET = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const { searchParams } = new URL(request.url);
  return DashboardService.get({ type: searchParams.get("type") });
});
