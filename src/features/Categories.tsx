"use client";

import React, { useState } from "react";

interface CategoryProps {
    className?: string;
}

const Categories: React.FC<CategoryProps> = ({ className }) => {
    const [activeCategory, setActiveCategory] =
        useState<string>("All Products");

    const categories = [
        "All Products",
        "Antibiotics & Antimicrobials",
        "Pain & Fever Management",
        "Cancer & Bone Health",
        "Hormonal Medications",
        "Anticoagulants & Hemostasis",
        "Fluid & Electrolyte",
    ];

    return (
        <div className={`${className}`}>
            <div className='flex overflow-x-auto gap-2 py-2 no-scrollbar'>
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`
              whitespace-nowrap px-4 py-2 rounded-lg border text-sm font-medium 
              transition-colors duration-200 focus:outline-none cursor-pointer
              ${
                  activeCategory === category
                      ? "bg-light-primary text-primary border-primary "
                      : "border-slate-200"
              }
            `}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Categories;
