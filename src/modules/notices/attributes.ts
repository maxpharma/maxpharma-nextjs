import { allocUnsafe } from "bun";
import { DataTypes } from "sequelize";
const noticeAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  documentType: {
    type: DataTypes.STRING,
  },
  title: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
  },
  file: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export { noticeAttributes };