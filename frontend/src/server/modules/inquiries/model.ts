import { getDb } from "../../config/db";
import Product from "../products/model";
import { inquiryAttributes } from "./attributes";

const Inquiry = getDb().define("inquiries", inquiryAttributes,{
    tableName: "inquiries",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
});

Inquiry.belongsTo(Product, {
    foreignKey:"productId",
    as:"productData"
})

Inquiry.addScope("withProduct", () => {
    const scope:any = {
        model: Product,
        as:"productData",
        where: {}
    }
    return {
        include: [scope]
    }
})

export default Inquiry