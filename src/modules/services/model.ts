import db from "../../config/db";
import { serviceAttributes } from "./attributes";
const Service = db.define("services", serviceAttributes, {
  tableName: "services",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Service;