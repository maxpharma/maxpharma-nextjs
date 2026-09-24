import env from "../config/env";
import { ERROR_MESSAGES } from "../utils/messages";

// Ported from backend/src/middleware/checkApiKey.ts. Currently unused by
// any route, matching the disabled `onBeforeHandle` call in the old
// server.ts — kept available if API-key enforcement is re-enabled later.
const requireApiKey = async (request: Request) => {
  const apiKey = request.headers.get("Api-Key");
  if (apiKey !== env.API_KEY) {
    throw new Error(ERROR_MESSAGES.INVALID_API_KEY);
  }
  return true;
};

export default requireApiKey;
