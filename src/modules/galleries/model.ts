import db from "../../config/db";
import Image from "../images/model";
import { galleryAttributes } from "./attributes";
const Gallery = db.define("galleries", galleryAttributes, {
  tableName: "galleries",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

Gallery.hasMany(Image,{
  foreignKey: 'galleryId',
  as: 'gallery'
})

Gallery.addScope("withImage", () => {
  const scope = {
    model: Image,
    as: 'gallery',
    attributes: ['id','galleryId','file'],
  }

  return {
    include : [scope]
  }
})

export default Gallery;