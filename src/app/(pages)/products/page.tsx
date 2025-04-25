import Categories from "@/features/Categories";
import Products from "@/features/Products";
import ScrollReveal from "@/components/animation/ScrollReveal";
import React from "react";

const page = () => {
    return (
        <ScrollReveal>
            <section className='space-y-4'>
                <Products />
            </section>
        </ScrollReveal>
    );
};

export default page;
