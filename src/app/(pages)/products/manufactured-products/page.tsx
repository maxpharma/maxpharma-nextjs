import Categories from "@/features/Categories";
import Products from "@/features/Products";
import React from "react";

const page = () => {
    return (
        <div>
            <section className='space-y-4'>
                <Products />
            </section>
        </div>
    );
};

export default page;
