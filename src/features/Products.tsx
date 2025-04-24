"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GeneralSettings from "@/api/generalSettings";
import ProductsApi from "@/api/product";
import CustomImage from "@/components/CustomImage";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

const Products: React.FC = () => {
    const [activeCategory, setActiveCategory] =
        useState<string>("All Products");
    const { data: categoriesRaw } = useSelector(
        (state: any) => state.categories
    );

    // Fetch categories if not loaded
    useEffect(() => {
        if (!categoriesRaw?.length) {
            GeneralSettings.getByGroup("categories", "categories");
        }
    }, [categoriesRaw?.length]);

    // Prepare categories list
    const categories = [
        "All Products",
        ...(categoriesRaw?.map((c: any) => c.value) || []),
    ];

    const activeCategoryId = categoriesRaw.find(
        (category: any) => activeCategory === category.value
    )?.id;

    const [products, setProducts] = useState<any[]>([]);
    const fetchProducts = async () => {
        if (activeCategory === "All Products") {
            const response = await ProductsApi.get();

            setProducts(response.items);
        } else {
            const response = await ProductsApi.get(activeCategoryId);
            setProducts(response.items); // Update to setProducts(response.items) for consistency
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [products?.length, activeCategoryId]);

    return (
        <div>
            {/* Categories */}
            <div className='flex overflow-x-auto gap-2 py-2 no-scrollbar'>
                {categories.map((category: string) => (
                    <button
                        key={category}
                        className={`
                            whitespace-nowrap px-4 py-2 rounded-lg border text-sm font-medium 
                            transition-colors duration-200 focus:outline-none cursor-pointer
                            ${
                                activeCategory === category
                                    ? "bg-light-primary text-primary border-primary"
                                    : "border-slate-200"
                            }
                        `}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
            {/* Products List */}
            <div className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {products?.length === 0 && (
                    <div className='col-span-full text-center text-gray-500'>
                        No products found.
                    </div>
                )}

                {products.map((item: any) => (
                    <Items
                        key={item.id}
                        id={item.id}
                        categoryName={item.categoryData.value}
                        name={item.name}
                        title={item.title}
                        description={item.description}
                        type={item.type}
                        files={item.files}
                        additionalInfo={item.additionalInfo}
                    />
                ))}
            </div>
        </div>
    );
};

export default Products;

const Items = ({
    name,
    title,
    categoryName,
    type,
    files,
    additionalInfo,
    description,
    id,
}: any) => {
    const router = useRouter();

    return (
        <div
            className='relative flex flex-col gap-4 border border-slate-300 rounded-xl w-full sm:max-w-sm cursor-pointer '
            onClick={() => router.push(`/products/${id}`)}
        >
            <div className='px-4 pt-4 pb-8 w-full space-y-4 '>
                <div className='relative'>
                    <CustomImage
                        src={files[0]}
                        fit='cover'
                        className='w-full h-40'
                        variant='live'
                    />
                    <div className='absolute top-2 left-2 rounded-xl p-1 bg-[#FAFBEA]'>
                        {categoryName}
                    </div>
                </div>
                <div>
                    <div className='text-lg'>{name}</div>
                    <span
                        className='text-sm'
                        dangerouslySetInnerHTML={{
                            __html:
                                typeof description === "string"
                                    ? description.split(" ").length > 10
                                        ? description
                                              .split(" ")
                                              .slice(0, 10)
                                              .join(" ") + "..."
                                        : description
                                    : "",
                        }}
                    />
                </div>
            </div>
            <Button className='absolute -bottom-6 right-4'>Send Inquiry</Button>
        </div>
    );
};
