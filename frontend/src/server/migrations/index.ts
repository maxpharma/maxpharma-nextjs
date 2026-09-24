import { getDb } from "../config/db";
import { Sequelize } from "sequelize";
import migrations from "./path";

const runMigration = async (migrationPath: string) => {
  const migration = require(migrationPath);
  const db = getDb();
  const queryInterface = db.getQueryInterface();
  await db.authenticate();
  await migration.up(queryInterface, Sequelize);
};

const runMigrations = async () => {
  for (const migrationPath of migrations) {
    console.log(`Running migration: ${migrationPath}`);
    await runMigration(migrationPath);
  }
  console.log("All specified migrations completed successfully.");
  await getDb().close();
};

runMigrations().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
