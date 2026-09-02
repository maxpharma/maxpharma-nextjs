import { Sequelize } from "sequelize";
import env from "./env";

const { DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT } = env;
if (!DB_NAME || !DB_USER || !DB_PASS || !DB_HOST) {
  throw new Error(
    "Missing required environment variables for database connection.",
  );
}

const db = new Sequelize(`${DB_NAME}`, `${DB_USER}`, `${DB_PASS}`, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  logging: false,
  timezone: "+05:45",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default db;