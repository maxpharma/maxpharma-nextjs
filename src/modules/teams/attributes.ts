import { DataTypes } from "sequelize";
const teamAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  additionalInfo: {
    type: DataTypes.JSON,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export { teamAttributes };