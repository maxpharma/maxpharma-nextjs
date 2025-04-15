import CustomImage from "@/components/CustomImage";
import { fetchByKey } from "@/utils/fetch";
import { Metadata } from "next";
import Image from "next/image";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
    const data: any = await fetchByKey("strategicObjectivesSeo");

    const parsedData = JSON.parse(data?.value || "{}");

    return {
        title: {
            default: parsedData?.title || "checks",
            template: "%s | Prabhu Steels",
        },
        description: parsedData?.description || "Default description",
        keywords: parsedData?.keywords || "Default keywords",
        icons: {
            icon: "/logo.ico",
            apple: "/logo.ico",
            shortcut: "/logo.ico",
        },
    };
}

const page = () => {
    return (
        <div className='flex flex-col items-center gap-4 md:gap-20 mt-16'>
            <div className='flex flex-col gap-4 items-center'>
                <Image
                    src={"/images/opsah.jpg"}
                    alt='Banner Image'
                    width={400}
                    height={400}
                    className='rounded-full size-48'
                    priority={true}
                />
                <span className='font-bold text-xl'>O.P Sah</span>
                <span className=''>Chairperson</span>
            </div>
            <div className='space-y-2'>
                <h1 className='mb-6'>My Message</h1>
                <p>
                    It gives me immense pride and satisfaction to reflect on the
                    journey of Max Pharma Pvt. Ltd, which began over two decades
                    ago with a clear mission: to provide reliable access to
                    quality medicines across Nepal. Through the years, our
                    unwavering commitment to healthcare excellence, strong
                    partnerships, and dedicated team have helped us grow into a
                    trusted name in the pharmaceutical industry.
                </p>
                <p>
                    As we look ahead, we are excited to enter a new chapter with
                    the establishment of our own pharmaceutical manufacturing
                    facility in Ishnath-3, Rautahat. This initiative marks not
                    just a business expansion, but a commitment to national
                    health security—aiming to reduce dependency on imports and
                    ensure timely availability of affordable, high-quality
                    medicines made in Nepal.
                </p>
                <p>
                    I would also like to acknowledge the incredible efforts of
                    our core marketing team, whose dedication to product
                    promotion and distribution has played a vital role in our
                    success. Their work ensures that our medicines reach every
                    corner of the country, touching lives and building trust.
                </p>
                <p>
                    At Max Pharma, we remain guided by our core values—quality,
                    integrity, and service. With the continued support of our
                    partners, healthcare professionals, and our hardworking
                    team, I am confident that we will continue to contribute
                    meaningfully to Nepal&apos;s healthcare system for many more
                    years to come.
                </p>
                <div className='flex flex-col gap-2  mt-8'>
                    <span className='text-primary'>Warn Regards,</span>
                    <span className='font-bold'>O.P Sah</span>
                    <span>Chairperson</span>
                    <span>Max Pharma Pvt. Ltd</span>
                </div>
            </div>
        </div>
    );
};

export default page;
