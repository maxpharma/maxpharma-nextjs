import { getDb } from "../../config/db";
import GeneralSetting from "../generalSettings/model";
import { productAttributes } from "./attributes";

const Product = getDb().define("products", productAttributes, {
  tableName: "products",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

Product.belongsTo(GeneralSetting, {
  foreignKey: "categoryId",
  as: "categoryData",
});

Product.addScope("withCategory", () => {
  const scope = {
    model: GeneralSetting,
    as: "categoryData",
    attributes: ["id", "value", "type"],
    required: false,
  };

  return {
    include: [scope],
  };
});

export default Product;