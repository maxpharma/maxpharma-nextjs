"use client";

import ScrollReveal from "@/components/animation/ScrollReveal";
import Banner from "@/components/Banner";
import Button from "@/components/Button";
import CustomImage from "@/components/CustomImage";
import AboutUs from "@/features/AboutUs";
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
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <>
      <div className="custom-container mt-4 flex flex-col gap-4 md:gap-16">
        <ScrollReveal>
          <Banner />
        </ScrollReveal>

        <ScrollReveal>
          <AboutUs />
        </ScrollReveal>
        <ScrollReveal>
          <AdvertisementBanner />
        </ScrollReveal>

        <ScrollReveal>
          <section className="space-y-4">
            <Products variant="scroll" />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="space-y-4  mt-8">
            <Notices limit={3} />
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="bg-light-primary rounded-2xl px-4 py-8">
            <div className="flex max-sm:flex-col items-center justify-between">
              <div className="flex flex-col gap-4 md:gap-8  max-w-2xl">
                <div className="text-lg md:text-2xl lg:text-4xl font-semibold">
                  Caring For Your Health, Every Step Of The Way
                </div>
                <p>
                  From trusted medications to expert healthcare guidance—your
                  wellness is our priority. Got questions? We’re here to help!
                </p>
                <Link href={"/contact"}>
                  {" "}
                  <Button>Let&apos;s Talk</Button>
                </Link>
              </div>
              <div className="ml-auto">
                <CustomImage
                  src="/images/ad-banner.png"
                  className="w-48 h-48 md:w-64 md:h-64 "
                />
              </div>
            </div>
          </section>
        </ScrollReveal>
        <ScrollReveal>
          <section className="space-y-4">
            <Faqs type="Home" />
          </section>
        </ScrollReveal>
        <ScrollReveal>
          <section>
            <BottomBanners />
          </section>
        </ScrollReveal>
        <ScrollReveal>
          <section>
            <ContactUs />
          </section>
        </ScrollReveal>
      </div>
    </>
  );
};

export default Page;
