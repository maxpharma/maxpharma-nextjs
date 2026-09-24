import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import GalleryService from "@/server/modules/galleries/service";

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  return GalleryService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    search: searchParams.get("search") || null,
  });
});

export const POST = apiHandler(async (request) => {
  await requireAdmin(request, ["admin", "user"]);
  const body = await request.json();
  return GalleryService.create(body);
});
