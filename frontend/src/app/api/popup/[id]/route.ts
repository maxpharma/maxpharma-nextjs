import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import PopupService from "@/server/modules/popup/service";

export const GET = apiHandler(async (_request, { params }) => {
  const { id } = await params;
  return PopupService.find(id);
});

export const PATCH = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  const body = await request.json();
  return PopupService.update(body, Number(id));
});

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return PopupService.remove(Number(id));
});
