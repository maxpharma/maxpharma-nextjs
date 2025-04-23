"use client";

import GeneralSettings from "@/api/generalSettings";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface CategoryProps {
    className?: string;
}

const Categories: React.FC<CategoryProps> = ({ className }) => {
    const [activeCategory, setActiveCategory] =
        useState<string>("All Products");

    // const categories = [
    //     "All Products",
    //     "Antibiotics & Antimicrobials",
    //     "Pain & Fever Management",
    //     "Cancer & Bone Health",
    //     "Hormonal Medications",
    //     "Anticoagulants & Hemostasis",
    //     "Fluid & Electrolyte",
    // ];

    const { data: categoriesRaw } = useSelector(
        (state: any) => state.categories
    );

    const fetchData = async () => {
        await GeneralSettings.getByGroup("categories", "categories");
    };

    useEffect(() => {
        if (!categoriesRaw?.length) {
            fetchData();
        }
    }, [categoriesRaw?.length]);

    const categories =
        categoriesRaw?.map((category: any) => category.value) || [];

    return (
        <div className={`${className}`}>
            <div className='flex overflow-x-auto gap-2 py-2 no-scrollbar'>
                {categories.map((category: any) => (
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
