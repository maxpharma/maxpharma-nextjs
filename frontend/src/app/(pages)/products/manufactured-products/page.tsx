import Categories from "@/features/Categories";
import Products from "@/features/Products";
import { getSeoMetadata } from "@/utils/seo";
import React from "react";

export async function generateMetadata() {
    return await getSeoMetadata("manufacturedProductsSeo");
}

const page = () => {
    return (
        <div>
            <section className='space-y-4'>
                <Products type='Manufactured Products' />
            </section>
        </div>
    );
};

export default page;
