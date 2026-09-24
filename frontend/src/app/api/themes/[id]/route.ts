import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import ThemesService from "@/server/modules/themes/service";

export const GET = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return ThemesService.find(id);
});

export const PATCH = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  const body = await request.json();
  return ThemesService.update(body, Number(id));
});

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return ThemesService.remove(Number(id));
});
