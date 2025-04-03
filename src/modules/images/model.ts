import db from "../../config/db";
import { imageAttributes } from "./attributes";

const Image = db.define('images', imageAttributes, {
    tableName: 'images',
    timestamps: true,
    createdAt: 'createdAt', 
    updatedAt: 'updatedAt'
})

export default Image;