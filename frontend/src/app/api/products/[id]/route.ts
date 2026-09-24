import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import ProductService from "@/server/modules/products/service";

export const GET = apiHandler(async (_request, { params }) => {
  const { id } = await params;
  return ProductService.find(id);
});

export const PATCH = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  const body = await request.json();
  return ProductService.update(body, Number(id));
});

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return ProductService.remove(Number(id));
});
