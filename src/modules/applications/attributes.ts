import { DataTypes } from "sequelize";
const applicationAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  citizenship: {
    type: DataTypes.STRING,
  },
  bankDeposit: {
    type: DataTypes.STRING,
  },
  requestForm: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export { applicationAttributes };