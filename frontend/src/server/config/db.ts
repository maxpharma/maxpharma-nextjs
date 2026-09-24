import { Sequelize } from "sequelize";
import pg from "pg";
import env from "./env";

let _db: Sequelize | null = null;

const getDb = (): Sequelize => {
  if (_db) return _db;

  if (!env.DATABASE_URL) {
    throw new Error(
      "Missing required DATABASE_URL environment variable for database connection.",
    );
  }

  _db = new Sequelize(env.DATABASE_URL, {
    dialect: "postgres",
    dialectModule: pg,
    logging: false,
    pool: {
      max: 2,
      min: 0,
      acquire: 15000,
      idle: 5000,
    },
  });

  return _db;
};

export { getDb };
