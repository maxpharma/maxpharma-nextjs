import db from "../../config/db";
import { teamAttributes } from "./attributes";
const Application = db.define("teams", teamAttributes, {
  tableName: "teams",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Application;