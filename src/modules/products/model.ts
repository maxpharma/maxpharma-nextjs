import db from "../../config/db";
import { productAttributes } from "./attributes";
const Product = db.define("products", productAttributes, {
  tableName: "products",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Product;