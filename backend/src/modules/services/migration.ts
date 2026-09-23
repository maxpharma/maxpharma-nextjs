import { QueryInterface } from "sequelize";
import { serviceAttributes } from "./attributes";

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable("services", serviceAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable("services");
};

export { up, down };