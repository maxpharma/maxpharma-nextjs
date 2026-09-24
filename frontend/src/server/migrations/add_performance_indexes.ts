import { QueryInterface } from "sequelize";

const indexesToAdd = [
  // Products
  { table: "products", fields: ["type", "createdAt"], name: "idx_products_type_created" },
  { table: "products", fields: ["categoryId", "createdAt"], name: "idx_products_cat_created" },
  { table: "products", fields: ["createdAt"], name: "idx_products_created" },

  // Admins
  { table: "admins", fields: ["email"], name: "idx_admins_email" },
  { table: "admins", fields: ["username"], name: "idx_admins_username" },
  { table: "admins", fields: ["role"], name: "idx_admins_role" },

  // Notices
  { table: "notices", fields: ["type", "createdAt"], name: "idx_notices_type_created" },
  { table: "notices", fields: ["createdAt"], name: "idx_notices_created" },

  // Contacts
  { table: "contacts", fields: ["status"], name: "idx_contacts_status" },
  { table: "contacts", fields: ["createdAt"], name: "idx_contacts_created" },

  // Inquiries
  { table: "inquiries", fields: ["status"], name: "idx_inquiries_status" },
  { table: "inquiries", fields: ["createdAt"], name: "idx_inquiries_created" },

  // Services
  { table: "services", fields: ["categoryId"], name: "idx_services_category" },
  { table: "services", fields: ["type"], name: "idx_services_type" },
  { table: "services", fields: ["createdAt"], name: "idx_services_created" },

  // Galleries
  { table: "galleries", fields: ["createdAt"], name: "idx_galleries_created" },

  // About Us
  { table: "about_us", fields: ["type"], name: "idx_about_us_type" },
  { table: "about_us", fields: ["createdAt"], name: "idx_about_us_created" },

  // Popups
  { table: "popups", fields: ["status"], name: "idx_popups_status" },

  // General Settings
  { table: "general_settings", fields: ["type"], name: "idx_general_settings_type" },
];

const up = async (queryInterface: QueryInterface) => {
  for (const idx of indexesToAdd) {
    try {
      await queryInterface.addIndex(idx.table, idx.fields, {
        name: idx.name,
      });
      console.log(`[Index Created] ${idx.name} on ${idx.table} (${idx.fields.join(", ")})`);
    } catch (err: any) {
      if (!err.message?.includes("already exists")) {
        console.warn(`[Index Warning] ${idx.name}:`, err.message);
      }
    }
  }
};

const down = async (queryInterface: QueryInterface) => {
  for (const idx of indexesToAdd) {
    try {
      await queryInterface.removeIndex(idx.table, idx.name);
    } catch (err) {
      // Ignore on down
    }
  }
};

export { up, down };
