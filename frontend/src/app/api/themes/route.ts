import { apiHandler } from "@/server/lib/apiHandler";
import ThemesService from "@/server/modules/themes/service";

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  return ThemesService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    search: searchParams.get("search") || null,
  });
});

export const POST = apiHandler(async (request) => {
  const body = await request.json();
  return ThemesService.create(body);
});
