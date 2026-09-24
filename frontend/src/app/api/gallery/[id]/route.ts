import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import GalleryService from "@/server/modules/galleries/service";

export const GET = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return GalleryService.find({ id });
});

export const PATCH = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  const body = await request.json();
  return GalleryService.update(body, Number(id));
});

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return GalleryService.remove(Number(id));
});
