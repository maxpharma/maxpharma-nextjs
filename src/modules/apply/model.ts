import db from "../../config/db";
import Notice from "../notices/model";
import { applyAttributes } from "./attributes";
const Apply = db.define("applies", applyAttributes, {
  tableName: "applies",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

Apply.belongsTo(Notice, {
  foreignKey:"noticeId",
  as:"noticeData"
})

Apply.addScope("withNotice", () => {
  const scope:any = {
      model: Notice,
      as:"noticeData",
      where: {}
  }
  return {
      include: [scope]
  }
})

export default Apply;