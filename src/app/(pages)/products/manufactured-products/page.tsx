import Categories from "@/features/Categories";
import Products from "@/features/Products";
import React from "react";

const page = () => {
    return (
        <div>
            <section className='space-y-4'>
                <h1>Our Products</h1>
                <Products />
            </section>
        </div>
    );
};

export default page;
