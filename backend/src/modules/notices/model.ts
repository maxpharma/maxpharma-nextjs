import db from "../../config/db";
import { noticeAttributes } from "./attributes";
const Notice = db.define("notices", noticeAttributes, {
  tableName: "notices",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Notice;