import { getDb } from "../../config/db";
import { adminAttributes } from "./attributes";
import { Op } from "sequelize";

const Admin = getDb().define("admins", adminAttributes, {
  tableName: "admins",
  timestamps: true,
  paranoid: true,
});

const insertHook = async (data: any) => {
  const exist = await Admin.findOne({
    where: {
      [Op.or]: [{ email: data.email }, { username: data.username }],
    },
  });

  if (exist) {
    throw new Error("User already exists");
  }
};

Admin.beforeCreate(insertHook);

export default Admin;