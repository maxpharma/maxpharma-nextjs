import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import AboutUsService from "@/server/modules/aboutUs/service";

export const GET = apiHandler(async (_request, { params }) => {
  const { id } = await params;
  return AboutUsService.find(id);
});

export const PATCH = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  const body = await request.json();
  return AboutUsService.update(body, Number(id));
});

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return AboutUsService.remove(Number(id));
});
