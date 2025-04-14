"use client";

import Banner from "@/components/Banner";
import CustomImage from "@/components/CustomImage";
import Button from "@/components/ui/Button";
import AdvertisementBanner from "@/features/AdvertisementBanner";
import BottomBanners from "@/features/BottomBanners";
import Categories from "@/features/Categories";
import ContactUs from "@/features/ContactUs";
import Faqs from "@/features/Faqs";
import GalleryCard from "@/features/GalleryCard";
import Notices from "@/features/Notices";
import Products from "@/features/Products";
import { associatesLogos, chairPerson, stakeHoldersLogos } from "@/utils/data";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();

    return (
        <>
            <Banner />
            <div className='custom-container mt-4 flex flex-col gap-4 md:gap-20'>
                {/* Who are we? */}
                <section className='space-y-4 '>
                    <div className='flex flex-col lg:flex-row gap-12'>
                        <div className='space-y-6 lg:w-7/10'>
                            {/* Your text content stays the same */}
                            <h1>Who are we?</h1>
                            <p>
                                Max Pharma Pvt. Ltd, based in Bagdurbar,
                                Sundhara, Kathmandu, Nepal, has been a
                                well-established and trusted name in the
                                pharmaceutical industry for over 22 years. We
                                have built our foundation by consistently
                                importing high-quality medicines from India and
                                distributing them efficiently across all regions
                                of Nepal. Our strong nationwide network has
                                helped us reach even the most remote areas,
                                ensuring timely access to essential medicines.
                            </p>
                            <p className='max-md:hidden'>
                                One of our key strengths lies in our dedicated
                                core Sales & Marketing team, which works
                                tirelessly to promote our products and support
                                their effective distribution. This passionate
                                and experienced team plays a vital role in
                                maintaining strong relationships with healthcare
                                professionals, hospitals, and pharmacies,
                                contributing significantly to our continued
                                growth.
                            </p>
                            <Button
                                onClick={() => {
                                    router.push("/about");
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    });
                                }}
                            >
                                Learn More
                            </Button>
                        </div>

                        {/* Gallery card with proper spacing */}
                        <div className='lg:w-3/10 mt-8 lg:mt-0'>
                            <GalleryCard />
                        </div>
                    </div>
                </section>

                {/* Our major stake holders */}
                <AdvertisementBanner />

                <section className='space-y-4'>
                    <h1>Our Products</h1>
                    <Categories />
                    <Products />
                </section>

                <section className='space-y-4'>
                    <h1>Latest Notices</h1>
                    <Notices limit={3} />
                </section>

                <section className='bg-light-primary rounded-2xl px-4 py-8'>
                    <div className='flex justify-between items-center'>
                        <div className='flex flex-col gap-4 max-w-2xl'>
                            <div className='text-lg md:text-2xl lg:text-4xl font-semibold'>
                                Caring For Your Health, Every Step Of The Way
                            </div>
                            <p>
                                From trusted medications to expert healthcare
                                guidance—your wellness is our priority. Got
                                questions? We’re here to help!
                            </p>
                            <Button>Let&apos;s Talk</Button>
                        </div>
                        <div>
                            <CustomImage src='/images/ad-banner.png' />
                        </div>
                    </div>
                </section>

                <section className='space-y-4'>
                    <h1 className='text-center'>Hava a Question?</h1>
                    <p className='text-center'>
                        We’ve got answers to the most common queries to help you
                        out—quick, clear, and hassle-free.
                    </p>
                    <Faqs />
                </section>

                <section>
                    <BottomBanners />
                </section>

                <section>
                    <ContactUs />
                </section>
            </div>
        </>
    );
};

export default Page;
