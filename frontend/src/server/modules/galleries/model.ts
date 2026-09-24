import { getDb } from "../../config/db";
import { galleryAttributes } from "./attributes";
const Gallery = getDb().define("galleries", galleryAttributes, {
  tableName: "galleries",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

export default Gallery;