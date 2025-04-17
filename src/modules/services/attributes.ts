import { DataTypes } from "sequelize";
const serviceAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  description: {
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
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export { serviceAttributes };