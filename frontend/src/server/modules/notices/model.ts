import { getDb } from "../../config/db";
import { noticeAttributes } from "./attributes";
const Notice = getDb().define("notices", noticeAttributes, {
  tableName: "notices",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Notice;