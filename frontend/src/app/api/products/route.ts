import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import ProductService from "@/server/modules/products/service";

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  return ProductService.list({
    search: searchParams.get("search") || null,
    type: searchParams.get("type") || null,
    categoryId: searchParams.get("categoryId") || null,
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  });
});

export const POST = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const body = await request.json();
  return ProductService.create(body);
});
