import db from "../../config/db";
import { applyAttributes } from "./attributes";
const Apply = db.define("applies", applyAttributes, {
  tableName: "applies",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Apply;