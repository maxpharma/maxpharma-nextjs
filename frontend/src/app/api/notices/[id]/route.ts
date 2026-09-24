import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import NoticesService from "@/server/modules/notices/service";

export const GET = apiHandler(async (_request, { params }) => {
  const { id } = await params;
  return NoticesService.find(id);
});

export const PATCH = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  const body = await request.json();
  return NoticesService.update(body, Number(id));
});

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return NoticesService.remove(Number(id));
});
