import bcrypt from "bcryptjs";
import crypto from "crypto";
import env from "../config/env";
const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

const generateToken = async (obj: any) => {
  obj.createdAt = new Date();
  obj.createdAt.setMinutes(obj.createdAt.getMinutes() + 5);
  const jsonString = JSON.stringify(obj);
  const encodedData = Buffer.from(jsonString).toString("base64");
  const signature = crypto
    .createHmac("sha256", `${env.JWT_SECRET}`)
    .update(encodedData)
    .digest("hex");
  return `${encodedData}.${signature}`;
};

const reverseToken = async (token: string) => {
  const currenteDate = new Date();
  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }
  const [encodedData, providedSignature] = parts;
  const calculatedSignature = crypto
    .createHmac("sha256", `${env.JWT_SECRET}`)
    .update(encodedData)
    .digest("hex");
  if (calculatedSignature !== providedSignature) {
    return false;
  }
  const decodedData: any = Buffer.from(encodedData, "base64").toString("utf-8");
  const parse = JSON.parse(decodedData);
  if (currenteDate > new Date(parse.createdAt)) {
    return false;
  }
  return parse;
};
export { hashPassword, generateToken, reverseToken };