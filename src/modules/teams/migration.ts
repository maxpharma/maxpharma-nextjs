import { QueryInterface } from "sequelize";
import { teamAttributes } from "./attributes";

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable("teams", teamAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable("teams");
};

export { up, down };