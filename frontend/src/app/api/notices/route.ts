import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import NoticesService from "@/server/modules/notices/service";

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  return NoticesService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    search: searchParams.get("search") || null,
    type: searchParams.get("type") || null,
    categoryId: searchParams.get("categoryId") || null,
  });
});

export const POST = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const body = await request.json();
  return NoticesService.create(body);
});
