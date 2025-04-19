"use client";

import Button from "@/components/Button";
import CustomImage from "@/components/CustomImage";
import Input from "@/components/fields/Input";
import PhoneInput from "@/components/fields/Phone";
import TextArea from "@/components/fields/TextArea";
import Overlay from "@/components/Overlay";
import Categories from "@/features/Categories";
import Faqs from "@/features/Faqs";
import Products from "@/features/Products";
import SendInquiry from "@/features/SendInquiry";
import { Form, Formik } from "formik";
import { sub } from "framer-motion/client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { BsWhatsapp } from "react-icons/bs";
import { useSelector } from "react-redux";

const ProductDetailPage = () => {
    const { productId } = useParams();
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    // Get products from redux store
    const { items: productsData } = useSelector((state: any) => state.products);

    // Find the product matching the productId
    const product = productsData.find(
        (item: any) => String(item.id) === String(productId)
    );

    // Prepare additionalInfo text
    const additionalInfoText =
        product?.additionalInfo && typeof product.additionalInfo === "object"
            ? Object.values(product.additionalInfo).join(", ")
            : product?.additionalInfo ?? "";

    // If product not found, show a message
    if (!product) {
        return <div className='py-10 text-center'>Product not found.</div>;
    }

    return (
        <>
            <div className='py-6 space-y-8'>
                <div className='flex flex-col lg:flex-row gap-8'>
                    <div className='w-full lg:w-1/2'>
                        <div className='flex flex-col sm:flex-row gap-2'>
                            <div className='flex sm:flex-col order-2 sm:order-1 gap-4 overflow-x-auto sm:overflow-y-auto sm:h-100 '>
                                {product.files?.map(
                                    (file: string, idx: number) => (
                                        <CustomImage
                                            key={idx}
                                            src={file}
                                            className='w-22 h-22 sm:w-16  md:w-20  lg:w-24  flex-shrink-0 cursor-pointer border border-gray-200 rounded-sm hover:border-gray-400'
                                            fit='cover'
                                            variant='live'
                                        />
                                    )
                                )}
                            </div>
                            <div className='order-1 sm:order-2 flex-grow'>
                                <CustomImage
                                    src={product.files?.[0]}
                                    className='w-full h-64 sm:h-100   rounded-lg'
                                    fit='cover'
                                    variant='live'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col space-y-4 w-full lg:w-1/2'>
                        <span className='font-medium text-sm'>
                            {product.type}
                        </span>

                        <div className='text-xl sm:text-2xl font-semibold'>
                            {product.name}
                        </div>

                        <div className='spacey-y-1'>
                            <div className='text-lg font-medium'>
                                Specifications
                            </div>
                            <table className='w-full border-collapse'>
                                <tbody>
                                    {/* Example: Render additionalInfo as key-value rows */}
                                    {product.additionalInfo &&
                                        Object.entries(
                                            product.additionalInfo
                                        ).map(([key, value]: [string, any]) => (
                                            <tr
                                                key={key}
                                                className='border-b border-gray-100 flex flex-row justify-between py-2 '
                                            >
                                                <td className='text-gray-600 text-sm sm:text-base'>
                                                    {key}
                                                </td>
                                                <td className='font-medium text-sm sm:text-base'>
                                                    {String(value)}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        <div className='max-sm:hidden flex gap-4 pt-4'>
                            <button className='secondary-button w-full flex items-center justify-center gap-2 py-2.5'>
                                <BsWhatsapp className='text-lg' />
                                <span>Whatsapp</span>
                            </button>
                            <button
                                className='button w-full py-2.5'
                                onClick={() => setIsOverlayOpen(true)}
                            >
                                Send Inquiry
                            </button>
                        </div>
                        <div className='max-sm:fixed sm:hidden bottom-0 bg-white z-10 w-full border-t border-slate-300 flex gap-4 pr-6 py-2'>
                            <button className='secondary-button w-full flex items-center justify-center gap-2 py-2.5'>
                                <BsWhatsapp className='text-lg' />
                                <span>Whatsapp</span>
                            </button>
                            <button
                                className='button w-full py-2.5'
                                onClick={() => setIsOverlayOpen(true)}
                            >
                                Send Inquiry
                            </button>
                        </div>
                    </div>
                </div>
                <div className='space-y-2'>
                    <h1>Product Overview</h1>
                    <p>{product.description}</p>
                </div>
                <section className='space-y-4'>
                    <h1>Our Products</h1>
                    <Categories />
                    <Products limit={4} />
                </section>
                <div className='mt-16'>
                    <Faqs />
                </div>
            </div>
            {isOverlayOpen && (
                <Overlay
                    onClose={() => setIsOverlayOpen(false)}
                    isOpen={isOverlayOpen}
                >
                    <SendInquiry onSuccess={() => setIsOverlayOpen(false)} />
                </Overlay>
            )}
        </>
    );
};

export default ProductDetailPage;
