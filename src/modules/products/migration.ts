import { QueryInterface } from "sequelize";
import { productAttributes } from "./attributes";

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable("products", productAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable("products");
};

export { up, down };