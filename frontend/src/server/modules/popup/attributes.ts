import { DataTypes } from "sequelize";
const popupAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  image: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export { popupAttributes };