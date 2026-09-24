import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import ServicesService from "@/server/modules/services/service";

export const GET = apiHandler(async (_request, { params }) => {
  const { id } = await params;
  return ServicesService.find({ id });
});

export const PATCH = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  const body = await request.json();
  return ServicesService.update(body, Number(id));
});

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return ServicesService.remove(Number(id));
});
