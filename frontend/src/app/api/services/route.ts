import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import ServicesService from "@/server/modules/services/service";

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  return ServicesService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    categoryId: searchParams.get("categoryId") || null,
    search: searchParams.get("search") || null,
  });
});

export const POST = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const body = await request.json();
  return ServicesService.create(body);
});
