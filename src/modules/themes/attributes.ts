import { DataTypes } from "sequelize";
const themeAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  header: {
    type: DataTypes.STRING,
  },
  footer: {
    type: DataTypes.STRING,
  },
  footerText: {
    type: DataTypes.STRING,
  },
  primaryColor: {
    type: DataTypes.STRING,
  },
  primaryLightcolor: {
    type: DataTypes.STRING,
  },
  secondaryColor: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export { themeAttributes };