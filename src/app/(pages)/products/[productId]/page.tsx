"use client";

import ProductApi from "@/api/product";
import Overlay from "@/components/Overlay";
import ProductGallery from "@/components/ui/ProductGallery";
import Categories from "@/features/Categories";
import Faqs from "@/features/Faqs";
import Products from "@/features/Products";
import SendInquiry from "@/features/SendInquiry";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BsWhatsapp } from "react-icons/bs";
import { useSelector } from "react-redux";

const ProductDetailPage = () => {
    const { productId } = useParams();
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    // Get products from redux store
    const { data: productData } = useSelector(
        (state: any) => state.singleProduct
    );

    const fetchData = async () => {
        await ProductApi.getById(Number(productId));
    };

    useEffect(() => {
        fetchData();
    }, [productId]);

    // If product not found, show a message
    if (!productData) {
        return <div className='py-10 text-center'>Product not found.</div>;
    }

    console.log("Product Data:", productData?.description);

    return (
        <>
            <div className='py-6 space-y-16 mx-auto max-w-9/10'>
                <div className='flex flex-col lg:flex-row gap-8 '>
                    <div className='w-full lg:w-1/2'>
                        <div className='flex flex-col sm:flex-row gap-2'>
                            <div className='flex sm:flex-col order-2 sm:order-1 gap-4 overflow-x-auto sm:overflow-y-auto sm:h-100 '></div>
                            {Array.isArray(productData?.files) &&
                            productData.files.length > 0 ? (
                                <ProductGallery
                                    images={productData.files.map(
                                        (image: any) => ({
                                            src: `${process.env.NEXT_PUBLIC_BUCKET_URL}/${image}`,
                                            alt: image,
                                        })
                                    )}
                                />
                            ) : (
                                <div className='w-full h-64 flex items-center justify-center bg-gray-100 text-gray-400'>
                                    No images available
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='flex flex-col space-y-4 w-full lg:w-1/2'>
                        <span className='font-medium text-sm'>
                            {productData.type}
                        </span>

                        <div className='text-xl sm:text-2xl font-semibold'>
                            {productData.name}
                        </div>

                        <div className='spacey-y-1'>
                            <div className='text-lg font-medium'>
                                Specifications
                            </div>
                            <table className='w-full border-collapse'>
                                <tbody>
                                    {/* Example: Render additionalInfo as key-value rows */}
                                    {productData.additionalInfo &&
                                        Object.entries(
                                            productData.additionalInfo
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
                    <div
                        dangerouslySetInnerHTML={{
                            __html: productData.description || "",
                        }}
                    />
                </div>
                <section className='space-y-4'>
                    <h1>Our Products</h1>
                    <Products />
                </section>
                <div className='mt-24'>
                    <Faqs type='Product' />
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
