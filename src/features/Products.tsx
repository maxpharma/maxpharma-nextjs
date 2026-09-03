"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GeneralSettings from "@/api/generalSettings";
import ProductsApi from "@/api/product";
import CustomImage from "@/components/CustomImage";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/EmptyState";

// Add variant prop with default value "list"
interface ProductsProps {
    variant?: "scroll" | "list";
    type?: "Imported Products" | "Manufactured Products";
}

const Products: React.FC<ProductsProps> = ({
    variant = "list",
    type = "Imported Products",
}) => {
    const [activeCategory, setActiveCategory] =
        useState<string>("All Products");
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { data: categoriesRaw } = useSelector(
        (state: any) => state.categories
    );

    useEffect(() => {
        if (!categoriesRaw?.length) {
            GeneralSettings.getByGroup("categories", "categories");
        }
    }, [categoriesRaw?.length]);

    const categories = [
        "All Products",
        ...(categoriesRaw?.map((c: any) => c.value) || []),
    ];

    const activeCategoryId = categoriesRaw?.find?.(
        (category: any) => activeCategory === category.value
    )?.id;

    useEffect(() => {
        if (categoriesRaw?.length || activeCategory === "All Products") {
            const fetchProducts = async () => {
                setLoading(true);
                try {
                    let response;

                    if (activeCategory === "All Products") {
                        response = await ProductsApi.get();
                    } else {
                        response = await ProductsApi.get(activeCategoryId);
                    }

                    setProducts(response.items || []);
                } catch (error) {
                    console.error("Error fetching products:", error);
                    setProducts([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchProducts();
        }
    }, [activeCategory, activeCategoryId, categoriesRaw?.length]);

    const defaultProducts = [
        {
            id: 1,
            name: "Max-C 500mg Chewable",
            title: "Vitamin C Supplement",
            type: type,
            categoryData: { value: "Pharmaceuticals" },
            description: "High quality Vitamin C tablets for daily immune support.",
            files: ["/images/medicine.png"],
        },
        {
            id: 2,
            name: "Max-Paracetamol 650",
            title: "Analgesic & Antipyretic",
            type: type,
            categoryData: { value: "Pharmaceuticals" },
            description: "Fast-acting relief from fever and body pain.",
            files: ["/images/medicine.png"],
        },
        {
            id: 3,
            name: "Max-Multivitamin Gold",
            title: "Daily Health Supplement",
            type: type,
            categoryData: { value: "Healthcare" },
            description: "Complete multivitamin formulation for overall vitality.",
            files: ["/images/medicine.png"],
        },
    ];

    const displayProducts = products.length > 0 ? products : defaultProducts;

    return (
        <div className='space-y-4'>
            <h1>Our Products</h1>
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

            {/* Loading state */}
            {loading && (
                <div className='text-center py-8'>
                    <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent'></div>
                </div>
            )}

            {/* Products List */}
            {!loading &&
                (variant === "scroll" ? (
                    <div className='mt-4 flex overflow-x-auto gap-4 pb-8 scrollbar-hide'>
                        {displayProducts.length === 0 && (
                            <div className='col-span-full'>
                                <EmptyState
                                    title='No Products Found'
                                    message={`Oops! No products are available in this ${type}.`}
                                />
                            </div>
                        )}
                        {displayProducts.map((item: any) => (
                            <div className='flex-shrink-0 w-112' key={item.id}>
                                <Items
                                    id={item.id}
                                    categoryName={
                                        item.categoryData?.value || ""
                                    }
                                    name={item.name}
                                    title={item.title}
                                    description={item.description}
                                    type={item.type}
                                    files={item.files || []}
                                    additionalInfo={item.additionalInfo}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8'>
                        {displayProducts.length === 0 && (
                            <div className='col-span-full'>
                                <EmptyState
                                    title='No Products Found'
                                    message={`Oops! No products are available in this ${type}.`}
                                />
                            </div>
                        )}
                        {displayProducts.map((item: any) => (
                            <Items
                                key={item.id}
                                id={item.id}
                                categoryName={
                                    item.categoryData?.value || ""
                                }
                                name={item.name}
                                title={item.title}
                                description={item.description}
                                type={item.type}
                                files={item.files || []}
                                additionalInfo={item.additionalInfo}
                            />
                        ))}
                    </div>
                ))}
        </div>
    );
};

export default Products;

const Items = ({
    name,
    title,
    categoryName,
    type,
    files = [],
    additionalInfo,
    description,
    id,
}: any) => {
    const router = useRouter();
    const imageSrc = files && files.length > 0 && files[0] ? files[0] : "/images/medicine.png";

    return (
        <div
            className='relative flex flex-col gap-4 border border-slate-300 rounded-xl w-full h-full cursor-pointer'
            onClick={() => router.push(`/products/${id}`)}
        >
            <div className='px-4 pt-4 py-6  w-full h-full space-y-4'>
                <div className='relative w-full'>
                    <CustomImage
                        src={imageSrc}
                        fit='cover'
                        className='w-full h-80 object-contain'
                        variant='live'
                    />
                    {categoryName && (
                        <div className='absolute top-2 left-2 rounded-xl p-1 bg-[#FAFBEA]'>
                            {categoryName}
                        </div>
                    )}
                </div>
                <div className='w-full'>
                    <div className='text-lg font-normal'>{name}</div>
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
