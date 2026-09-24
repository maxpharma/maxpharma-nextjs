import { QueryInterface } from "sequelize";
import { galleryAttributes } from "./attributes";

const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable("galleries", galleryAttributes);
};

const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable("galleries");
};

export { up, down };