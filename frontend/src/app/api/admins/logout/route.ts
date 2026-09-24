import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import AdminService from "@/server/modules/admins/service";

export const POST = apiHandler(async (request) => {
  const user = await requireAdmin(request, ["admin"]);
  // ponytail: Admin.logout() client call POSTs with no body — an empty body
  // must not throw SyntaxError and short-circuit the redux user-reset.
  const body = await request.json().catch(() => ({}));
  return AdminService.logout(body, user.id);
});
