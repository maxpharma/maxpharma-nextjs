import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import AboutUsService from "@/server/modules/aboutUs/service";

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  return AboutUsService.list({
    search: searchParams.get("search") || null,
    type: searchParams.get("type") || null,
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  });
});

export const POST = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const body = await request.json();
  return AboutUsService.create(body);
});
