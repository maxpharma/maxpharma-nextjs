// Next.js loads .env/.env.local itself — no dotenv package needed here.
const env = {
  APP_NAME: process.env.APP_NAME || "Max Pharma",
  DB_NAME: process.env.DB_NAME || "maxpharma",
  DB_USER: process.env.DB_USER || "root",
  DB_PASS: process.env.DB_PASS || "password",
  DB_HOST: process.env.DB_HOST || "127.0.0.1",
  DB_PORT: Number(process.env.DB_PORT) || 3307,
  API_KEY: process.env.API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  MODE: process.env.MODE || "development",
  DIGITAL_SECRET_KEY: process.env.DIGITAL_SECRET_KEY || "",
  DIGITAL_ACCESS_ID: process.env.DIGITAL_ACCESS_ID || "",
  DIGITAL_BUCKET_URL:
    process.env.DIGITAL_BUCKET_URL ||
    "https://iservers.blr1.cdn.digitaloceanspaces.com",
  DIGITAL_ENDPOINT:
    process.env.DIGITAL_ENDPOINT || "https://blr1.digitaloceanspaces.com",
  DIGITAL_BUCKET_NAME: process.env.DIGITAL_BUCKET_NAME || "iservers",
  DIGITAL_BUCKET_FOLDER: process.env.DIGITAL_BUCKET_FOLDER || "maxpharma",
};

export default env;
