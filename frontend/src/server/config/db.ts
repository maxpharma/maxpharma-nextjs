import { Sequelize } from "sequelize";
import env from "./env";

// ponytail: lazy singleton so a missing DB_* env var at `next build` time
// doesn't crash the build — the old backend threw eagerly at import time,
// which was fine for a long-lived process but breaks a serverless build step.
let _db: Sequelize | null = null;

const getDb = (): Sequelize => {
  if (_db) return _db;

  const { DB_NAME, DB_USER, DB_PASS, DB_HOST } = env;
  if (!DB_NAME || !DB_USER || !DB_PASS || !DB_HOST) {
    throw new Error(
      "Missing required environment variables for database connection.",
    );
  }

  _db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: env.DB_PORT,
    dialect: "mysql",
    logging: false,
    timezone: "+05:45",
    // ponytail: pool sized for one Vercel Function instance, not the whole
    // app — put a connection pooler (PlanetScale / ProxySQL) in front of
    // MySQL so many concurrent instances don't exceed max_connections.
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
