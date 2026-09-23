import { QueryInterface } from "sequelize";
import { popupAttributes } from "./attributes";

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable("popups", popupAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable("popups");
};

export { up, down };