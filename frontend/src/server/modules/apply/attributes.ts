import { DataTypes } from "sequelize";
const applyAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  noticeId: {
    type: DataTypes.INTEGER,
    references: {
      model:"notices",
      key:"id",
      index:true
    },
    onDelete: "SET NULL"
  },
  name:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
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

export { applyAttributes };