import { DataTypes } from "sequelize";
import { Constant } from "../../utils";

const aboutUsAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT('long'),
    allowNull:false
  },
  files:{
    type: DataTypes.JSON,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  infos: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  }
}

export {aboutUsAttributes}