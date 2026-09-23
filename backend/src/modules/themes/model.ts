import db from "../../config/db";
import { themeAttributes } from "./attributes";
const Theme = db.define("themes", themeAttributes, {
  tableName: "themes",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Theme;