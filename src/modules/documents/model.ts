import db from "../../config/db";
import { documentAttributes } from "./attributes";
const Application = db.define("documents", documentAttributes, {
  tableName: "documents",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Application;