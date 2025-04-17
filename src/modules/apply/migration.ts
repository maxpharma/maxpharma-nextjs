import { QueryInterface } from "sequelize";
import { applyAttributes } from "./attributes";

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable("applies", applyAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable("applies");
};

export { up, down };