import { apiHandler } from "@/server/lib/apiHandler";
import AdminService from "@/server/modules/admins/service";

export const POST = apiHandler(async (request) => {
  const body = await request.json();
  return AdminService.create(body);
});
