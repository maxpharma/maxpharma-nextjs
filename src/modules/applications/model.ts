import db from "../../config/db";
import { applicationAttributes } from "./attributes";
const Application = db.define("applications", applicationAttributes, {
  tableName: "applications",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Application;