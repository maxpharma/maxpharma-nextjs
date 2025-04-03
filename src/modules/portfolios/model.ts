import db from "../../config/db";
import { portfolioAttributes } from "./attributes";

const Portfolio = db.define("portfolios", portfolioAttributes,{
    tableName: "portfolios",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
});

export default Portfolio