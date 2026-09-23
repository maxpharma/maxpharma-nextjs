import db from "../../config/db";
import { aboutUsAttributes } from "./attributes";

const AboutUs = db.define("about_us", aboutUsAttributes,{
    tableName: "about_us",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
});

export default AboutUs