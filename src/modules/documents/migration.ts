import { QueryInterface } from "sequelize";
import { documentAttributes } from "./attributes";

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable("documents", documentAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable("documents");
};

export { up, down };