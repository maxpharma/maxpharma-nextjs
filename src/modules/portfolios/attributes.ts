import { DataTypes } from "sequelize";
import { Constant } from "../../utils";

const portfolioAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  file:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
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

export {portfolioAttributes}