"use client";

import ProductApi from "@/api/product";
import Button from "@/components/Button";
import CustomImage from "@/components/CustomImage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Products = ({ limit = 10 }: { limit?: number }) => {
    const { items: productsData } = useSelector((state: any) => state.products);

    const fetchData = async () => {
        await ProductApi.get();
    };

    useEffect(() => {
        if (!productsData.length) {
            fetchData();
        }
    }, [productsData?.length]);

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 '>
            {productsData.map((item: any) => (
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
                    <span className='text-sm'>
                        {description.split(" ").length > 10
                            ? description.split(" ").slice(0, 10).join(" ") +
                              "..."
                            : description}
                    </span>
                </div>
            </div>
            <Button className='absolute -bottom-6 right-4'>Send Inquiry</Button>
        </div>
    );
};
