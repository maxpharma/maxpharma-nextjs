import { QueryInterface } from "sequelize";
import { noticeAttributes } from "./attributes";

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable("notices", noticeAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable("notices");
};

export { up, down };