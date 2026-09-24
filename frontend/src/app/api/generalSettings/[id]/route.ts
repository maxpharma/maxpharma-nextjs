import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import GeneralSettingsService from "@/server/modules/generalSettings/service";

export const PATCH = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  const body = await request.json();
  return GeneralSettingsService.update(body, Number(id));
});

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return GeneralSettingsService.remove(Number(id));
});
