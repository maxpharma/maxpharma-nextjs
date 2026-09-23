"use client";

import Products from "@/api/product";
import { deleteIcon, editIcon } from "@/assets/svg";
import ConfirmationAlert from "@/components/ConfirmationAlert";
import CustomImage from "@/components/CustomImage";
import DataTable from "@/components/DataTable";
import SvgIcon from "@/components/SvgIcon";
import Image from "next/image";
import helpers from "@/utils/helper";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ProductsData = ({ setUpdateIdData, filterType, filterCategory }: any) => {
    const fetchData = async () => {
        await Products.get();
    };

    const { items: ProductsData } = useSelector((state: any) => state.products);
    const rawCategoriesData = useSelector(
        (state: any) => state.categories?.data
    );
    const categoriesData = Array.isArray(rawCategoriesData)
        ? rawCategoriesData
        : [];

    useEffect(() => {
        if (!ProductsData?.length) {
            fetchData();
        }
    }, [ProductsData?.length]);

    const columns = [
        { id: "name", header: "Product Name", accessor: "name", minWidth: 170 },
        { id: "type", header: "Type", accessor: "type", minWidth: 120 },
        {
            id: "category",
            header: "Category",
            accessor: "category",
            minWidth: 150,
        },
        {
            id: "specifications",
            header: "Specifications",
            accessor: "specifications",
            minWidth: 100,
        },
        { id: "image", header: "Image", accessor: "image", minWidth: 300 },
        { id: "action", header: "Action", accessor: "action", minWidth: 120 },
    ];

    // Filtering by type and category
    const filteredProducts = (ProductsData || []).filter((item: any) => {
        let typeMatch = true;
        let categoryMatch = true;
        if (filterType && filterType !== "") {
            typeMatch = item.type === filterType;
        }
        if (filterCategory && filterCategory !== "") {
            categoryMatch =
                item.categoryName === filterCategory ||
                (item.categoryData &&
                    item.categoryData.value === filterCategory);
        }
        return typeMatch && categoryMatch;
    });

    const rows = (filteredProducts || []).map((item: any) => {
        // Format specifications to show first two items
        const specs = item?.additionalInfo || {};
        const specEntries = Object.entries(specs);
        const firstTwoSpecs = specEntries.slice(0, 2);

        return {
            name: item?.name,
            type: item?.type,
            category:
                categoriesData.find((cat: any) => cat.id === item.categoryId)
                    ?.value || "-",
            specifications: (
                <div className='space-y-1 text-sm'>
                    {firstTwoSpecs.length > 0 ? (
                        firstTwoSpecs.map(
                            ([key, value]: [string, any], index: number) => (
                                <div key={index} className='flex'>
                                    <span className='font-medium mr-1'>
                                        {key}:
                                    </span>
                                    <span>{value}</span>
                                </div>
                            )
                        )
                    ) : (
                        <span className='text-gray-400 italic'>
                            No specifications
                        </span>
                    )}
                    {specEntries.length > 2 && (
                        <span className='text-gray-500 italic'>
                            +{specEntries.length - 2} more
                        </span>
                    )}
                </div>
            ),

            image: (
                <div className='flex items-center gap-1'>
                    {item?.files && item?.files.length > 0
                        ? item.files
                              .slice(0, 5)
                              .map((file: string, idx: number) => (
                                  <div
                                      key={idx}
                                      className='relative w-8 h-8 rounded overflow-hidden border border-gray-200'
                                  >
                                      <Image
                                          src={helpers.getFileUrl(file)}
                                          alt={`img-${idx}`}
                                          fill
                                          className='object-cover'
                                      />
                                  </div>
                              ))
                        : null}
                    {item?.files && item.files.length > 0 && (
                        <span className='ml-2 text-xs text-gray-500'>
                            ({item.files.length})
                        </span>
                    )}
                </div>
            ),
            action: (
                <div className='flex gap-2'>
                    <button
                        onClick={() => {
                            setUpdateIdData({
                                id: item.id,
                                productName: item.name,
                                productOverview: item.description,
                                type: item.type,
                                categoryId: item.categoryId,
                                categoryName: item.categoryData?.value || "",
                                images: item.files || [],
                                specifications: item.additionalInfo || {},
                            });

                            // Safe scroll implementation for Next.js
                            setTimeout(() => {
                                if (typeof window !== "undefined") {
                                    // Check if window exists (for SSR)
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    });
                                }
                            }, 100);
                        }}
                        className='p-2'
                    >
                        <SvgIcon src={editIcon} />
                    </button>
                    <button onClick={() => handleDeleteClick(item.id)}>
                        <SvgIcon src={deleteIcon} />
                    </button>
                </div>
            ),
        };
    });

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setItemToDelete(id);
        setShowConfirmation(true);
    };

    const handleDelete = async () => {
        if (itemToDelete !== null) {
            await Products.deleteItem(itemToDelete);
            setShowConfirmation(false);
            fetchData();
        }
    };

    return (
        <>
            <div>
                <DataTable
                    title='Products'
                    columns={columns}
                    data={rows}
                    emptyMessage='No products found'
                />
            </div>
            {showConfirmation && (
                <ConfirmationAlert
                    message='Are you Sure you want to Delete This Product?'
                    confirmText='YES'
                    cancelText='NO'
                    onConfirm={() => handleDelete()}
                    onCancel={() => setShowConfirmation(false)}
                />
            )}
        </>
    );
};

export default ProductsData;
