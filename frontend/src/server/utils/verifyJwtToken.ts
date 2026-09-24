import jwt from "jsonwebtoken";
import env from "../config/env";
const verifyJwtToken = async (token: string) => {
  const secret = env.JWT_SECRET || "";
  const splitToken: any = token.split(" ").pop();
  const decoded: any = jwt.verify(splitToken, secret);
  if (!!decoded?.id) {
    return decoded;
  } else {
    return null;
  }
};

export default verifyJwtToken;