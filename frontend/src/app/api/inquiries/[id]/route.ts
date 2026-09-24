import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import InquiriesService from "@/server/modules/inquiries/service";

export const GET = apiHandler(async (_request, { params }) => {
  const { id } = await params;
  return InquiriesService.find(Number(id));
});

export const DELETE = apiHandler(async (request, { params }) => {
  await requireAdmin(request, ["admin"]);
  const { id } = await params;
  return InquiriesService.remove(Number(id));
});
