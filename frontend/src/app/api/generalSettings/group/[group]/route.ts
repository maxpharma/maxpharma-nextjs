import { apiHandler } from "@/server/lib/apiHandler";
import GeneralSettingsService from "@/server/modules/generalSettings/service";

export const GET = apiHandler(async (_request, { params }) => {
  const { group } = await params;
  return GeneralSettingsService.getByGroup(group);
});
