import { allocUnsafe } from "bun";
import { DataTypes } from "sequelize";
const productAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.STRING,
    unique:true
  },
  name: {
    type: DataTypes.STRING,
  },
  descripiton: {
    type: DataTypes.STRING,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    reference: {
      model:"general_settings",
      key:"id",
      index:true
    },
    allowNull: false
  },
  files: {
    type: DataTypes.JSON,
    allowNull: true
  },
  additionalInfo: {
    type: DataTypes.JSON,
    allowNull:true
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export { productAttributes };