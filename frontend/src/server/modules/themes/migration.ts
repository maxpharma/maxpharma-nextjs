import { QueryInterface } from "sequelize";
import { themeAttributes } from "./attributes";

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable("themes", themeAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable("themes");
};

export { up, down };