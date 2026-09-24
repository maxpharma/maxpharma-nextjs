import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import AdminService from "@/server/modules/admins/service";

export const POST = apiHandler(async (request) => {
  const user = await requireAdmin(request, ["admin"]);
  const body = await request.json();
  return AdminService.logout(body, user.id);
});
