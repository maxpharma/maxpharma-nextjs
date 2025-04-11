import db from "../../config/db";
import { galleryAttributes } from "./attributes";
const Gallery = db.define("galleries", galleryAttributes, {
  tableName: "galleries",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Gallery;