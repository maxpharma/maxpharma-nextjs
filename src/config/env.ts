import dotenv from "dotenv";
dotenv.config();

const env = {
  APP_NAME: process.env.APP_NAME || "Lagani Store",
  PORT: process.env.PORT || 9000,
  BUCKET_PORT: process.env.BUCKET_PORT || 9002,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_HOST: process.env.DB_HOST,
  API_KEY: process.env.API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  MODE: process.env.MODE || "production",
};

export default env;