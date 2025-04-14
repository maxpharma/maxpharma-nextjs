import GalleryCard from "@/features/GalleryCard";
import React from "react";

const page = () => {
    return (
        <section>
            <div className='flex flex-col lg:flex-row gap-12'>
                <div className='w-full lg:w-7/10 flex flex-col gap-2 md:gap-6'>
                    <h1>About Us</h1>
                    <p>
                        Max Pharma Pvt. Ltd, based in Bagdurbar, Sundhara,
                        Kathmandu, Nepal, has been a well-established and
                        trusted name in the pharmaceutical industry for over 22
                        years. We have built our foundation by consistently
                        importing high-quality medicines from India and
                        distributing them efficiently across all regions of
                        Nepal. Our strong nationwide network has helped us reach
                        even the most remote areas, ensuring timely access to
                        essential medicines.
                    </p>
                    <p>
                        One of our key strengths lies in our dedicated core
                        Sales & Marketing team, which works tirelessly to
                        promote our products and support their effective
                        distribution. This passionate and experienced team plays
                        a vital role in maintaining strong relationships with
                        healthcare professionals, hospitals, and pharmacies,
                        contributing significantly to our continued growth.
                    </p>
                    <p>
                        Looking ahead, we are proud to share that we are in the
                        process of establishing our own pharmaceutical
                        manufacturing facility in Ishnath-3, Rautahat. Expected
                        to be operational very soon, this facility represents a
                        major milestone in our mission to contribute to
                        Nepal&apos;s self-reliance in medicine production and to
                        ensure affordable, high-quality healthcare solutions for
                        the nation.
                    </p>
                </div>
                <div className='lg:w-3/10'>
                    <GalleryCard />
                </div>
            </div>
        </section>
    );
};

export default page;
