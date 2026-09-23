"use client";

import ProductApi from "@/api/product";
import Overlay from "@/components/Overlay";
import FixedInBottom from "@/components/ui/FixedInBottom";
import ProductGallery from "@/components/ui/ProductGallery";
import Faqs from "@/features/Faqs";
import Products from "@/features/Products";
import SendInquiry from "@/features/SendInquiry";
import Settings from "@/features/settings";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BsWhatsapp } from "react-icons/bs";
import { useSelector } from "react-redux";
import ScrollReveal from "@/components/animation/ScrollReveal";

const ProductDetailPage = () => {
    const { productId } = useParams();
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const settings = Settings();

    // Get products from redux store
    const { data: productData } = useSelector(
        (state: any) => state.singleProduct
    );

    useEffect(() => {
        if (productId) {
            ProductApi.getById(Number(productId));
        }
    }, [productId]);

    // If product not found, show a message
    if (!productData) {
        return <div className='py-10 text-center'>Product not found.</div>;
    }

    return (
        <>
            <ScrollReveal>
                <div className='py-2 md:py-4 space-y-16 mx-auto lg:max-w-9/10'>
                    <div className='flex flex-col lg:flex-row  md:gap-4 '>
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

                        <div className='flex flex-col justify-between space-y-2 w-full '>
                            <div>
                                <span className='font-medium text-sm'>
                                    {productData.type}
                                </span>

                                <div className='text-xl sm:text-2xl font-semibold'>
                                    {productData.name}
                                </div>

                                <div className='text-lg sm:text-xl'>
                                    {productData?.categoryData?.value}
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
                                                ).map(
                                                    ([key, value]: [
                                                        string,
                                                        any
                                                    ]) => (
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
                                                    )
                                                )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div>
                                <div className='max-sm:hidden flex gap-4 pt-4'>
                                    <a
                                        href={`https://wa.me/${settings?.whatsAppNumber}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='flex items-center gap-2 flex-1 w-full'
                                    >
                                        <button className='secondary-button w-full flex items-center justify-center gap-2 py-2.5'>
                                            <BsWhatsapp className='text-lg' />
                                            <span>Whatsapp</span>
                                        </button>
                                    </a>

                                    <button
                                        className='button  py-2.5 flex-1'
                                        onClick={() => setIsOverlayOpen(true)}
                                    >
                                        Send Inquiry
                                    </button>
                                </div>
                            </div>
                            <FixedInBottom className='sm:hidden flex gap-4 bg-white p-2 border-t border-gray-200'>
                                <a
                                    href={`tel:${settings?.whatsAppNumber}`}
                                    className='flex items-center gap-2 flex-1 w-full'
                                >
                                    <button className='secondary-button w-full flex items-center justify-center gap-2 py-2.5'>
                                        <BsWhatsapp className='text-lg' />
                                        <span>Whatsapp</span>
                                    </button>
                                </a>
                                <button
                                    className='button  py-2.5 flex-1'
                                    onClick={() => setIsOverlayOpen(true)}
                                >
                                    Send Inquiry
                                </button>
                            </FixedInBottom>
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
                        <Products variant='scroll' />
                    </section>
                    <div className='mt-24'>
                        <Faqs type='Product' />
                    </div>
                </div>
            </ScrollReveal>
            {isOverlayOpen && (
                <Overlay
                    onClose={() => setIsOverlayOpen(false)}
                    isOpen={isOverlayOpen}
                >
                    <SendInquiry setIsOverlayOpen={setIsOverlayOpen} />
                </Overlay>
            )}
        </>
    );
};

export default ProductDetailPage;
