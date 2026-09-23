import { QueryInterface } from "sequelize";
import { adminAttributes } from "./attributes";
const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable("admins", adminAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable("admins");
};
export { up, down };