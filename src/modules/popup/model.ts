import db from "../../config/db";
import { popupAttributes } from "./attributes";
const PopUp = db.define("popups", popupAttributes, {
  tableName: "popups",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default PopUp;