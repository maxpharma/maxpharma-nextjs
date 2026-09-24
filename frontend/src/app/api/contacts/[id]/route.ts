import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import ContactsService from "@/server/modules/contacts/service";

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin", "user"]);
  const { id } = await params;
  return ContactsService.remove(Number(id));
});
