import env from "../config/env";
import { ERROR_MESSAGES } from "../utils/messages";
const checkApiKey = async (request: any) => {
  const apiKey = request.headers.get("Api-Key");
  if (apiKey !== env.API_KEY) {
    throw new Error(ERROR_MESSAGES.INVALID_API_KEY);
  } else {
    return true;
  }
};

export default checkApiKey;