import { QueryInterface } from "sequelize";
import { applicationAttributes } from "./attributes";

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable("applications", applicationAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable("applications");
};

export { up, down };