import db from "../config/db";
import { QueryTypes } from "sequelize";
const password = "$2b$10$P85GuASDA6sDqk60pC3j2.rfT2Ir8opiJYXLAMkHrSitjMCas2euO";

const seeders = async () => {
  const existing = await db.query(
    "SELECT id FROM admins WHERE username = ? OR email = ?",
    {
      replacements: ["admin", "admin@gmail.com"],
      type: QueryTypes.SELECT,
    },
  );

  if (existing.length > 0) {
    console.log("Admin user already exists. Skipping seed.");
  } else {
    await db.query(
      "INSERT INTO admins (name,email,password,username,createdAt,updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      {
        replacements: [
          "Admin",
          "admin@gmail.com",
          password,
          "admin",
          new Date(),
          new Date(),
        ],
        type: QueryTypes.INSERT,
      },
    );
    console.log("Dummy admin data seeded successfully.");
  }
  await db.close();
};

seeders().catch((error) => {
  console.error("Failed to seed:", error);
  process.exit(1);
});