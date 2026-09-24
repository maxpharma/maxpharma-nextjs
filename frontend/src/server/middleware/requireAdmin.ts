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

// Ported from backend/src/middleware/checkAuthentication.ts. Elysia's
// beforeHandle hook is gone — this is called as a plain function at the
// top of each protected route.ts handler instead.
const requireAdmin = async (request: Request, allowTo: string[] = []) => {
  const token = request.headers.get("authorization");
  if (!token && allowTo.includes("public")) {
    return null;
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
  }
  if (!Array.isArray(allowTo) || !allowTo?.length) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
  }
  let user = null;
  await checkSpecificRole(decoded, allowTo);
  if (decoded?.role === "admin") {
    const userInfo = await AdminService.find(decoded.id);
    user = {
      ...(userInfo as any)?.dataValues,
      role: "admin",
    };
  } else {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
  }
  return user;
};

export { roles };
export default requireAdmin;
