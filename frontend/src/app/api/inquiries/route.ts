import { apiHandler } from "@/server/lib/apiHandler";
import requireAdmin from "@/server/middleware/requireAdmin";
import InquiriesService from "@/server/modules/inquiries/service";

export const GET = apiHandler(async (request) => {
  await requireAdmin(request, ["admin"]);
  const { searchParams } = new URL(request.url);
  return InquiriesService.list({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  });
});

export const POST = apiHandler(async (request) => {
  const body = await request.json();
  return InquiriesService.create(body);
});
