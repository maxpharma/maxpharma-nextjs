import { DataTypes } from "sequelize";
const documentAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  file: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export { documentAttributes };