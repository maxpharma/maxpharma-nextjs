import verifyJwtToken from "../utils/verifyJwtToken";
import AdminService from "../modules/admins/service";
import { ERROR_MESSAGES } from "../utils/messages";
const roles = ["admin"];
const checkSpecificRole = async (user: any, allowTo: string[]) => {
  if (!allowTo.includes(user?.role || user?.type)) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
  }
  return user;
};
const checkAuthentication = async (request: any, allowTo: string[] = []) => {
  try {
    const token = request.headers["authorization"];
    if (!token && allowTo.includes("public")) {
      return request;
    }
    if (!token) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
    }
    const tokenWithoutBearer = token.startsWith("Bearer ")
      ? token.slice(7)
      : token;
    const decoded = await verifyJwtToken(tokenWithoutBearer);
    if (!decoded) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
    } else {
      if (!Array.isArray(allowTo) || !allowTo?.length) {
        throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
      } else {
        let user = null;
        await checkSpecificRole(decoded, allowTo);
        if (decoded?.role == "admin") {
          const userInfo = await AdminService.find(decoded.id);
          user = {
            ...userInfo?.dataValues,
            role: "admin",
          };
        } else {
            throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
        }
        request.user = user;
      }
    }
  } catch (err: any) {
    throw new Error(err.message || "Unauthorized");
  }
};

export default checkAuthentication;