import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import PopupService from "@/server/modules/popup/service";

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  return PopupService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    search: searchParams.get("search") || null,
    type: searchParams.get("type") || null,
  });
});

export const POST = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const body = await request.json();
  return PopupService.create(body);
});
