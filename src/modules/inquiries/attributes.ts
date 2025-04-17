import { DataTypes } from "sequelize";
import { Constant } from "../../utils";

const inquiryAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: "products",
      key:'id',
      index:true
    },
    onDelete: "CASCADE",
    allowNull:false
  },
  name:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  }
}

export {inquiryAttributes}