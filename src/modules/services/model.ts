import db from "../../config/db";
import GeneralSetting from "../generalSettings/model";
import { serviceAttributes } from "./attributes";
const Service = db.define("services", serviceAttributes, {
  tableName: "services",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

Service.belongsTo(GeneralSetting, {
  foreignKey:"categoryId",
  as:"categoryData"
})

Service.addScope("withCategory", () => {
  const scope = {
    model:GeneralSetting,
    as:"categoryData",
    where:{}
  }

  return {
    include: [scope]
  }
})

export default Service;