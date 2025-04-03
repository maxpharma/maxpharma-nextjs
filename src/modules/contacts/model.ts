import db from "../../config/db";
import { contactAttributes } from "./attributes";

const Contact = db.define("contacts", contactAttributes,{
    tableName: "contacts",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
});

export default Contact