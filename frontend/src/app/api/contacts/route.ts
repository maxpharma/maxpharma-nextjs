import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import ContactsService from "@/server/modules/contacts/service";

export const GET = apiHandler(async (request) => {
  await requireAdmin(request, ["admin", "user"]);
  const { searchParams } = new URL(request.url);
  return ContactsService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  });
});

export const POST = apiHandler(async (request) => {
  const body = await request.json();
  return ContactsService.create(body);
});
