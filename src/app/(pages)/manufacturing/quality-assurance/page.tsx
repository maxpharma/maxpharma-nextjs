import GalleryCard from "@/features/GalleryCard";
import React from "react";

const page = () => {
    return (
        <section>
            <div className='flex flex-col lg:flex-row gap-4 lg:gap-12 lg:items-center'>
                <div className='w-full lg:w-6/10 flex flex-col gap-2 md:gap-6'>
                    <h1>Quality Assurance</h1>
                    <p>
                        At Max Pharma Pvt. Ltd., our Quality Assurance (QA) team
                        ensures strict documentation and record-keeping in line
                        with GMP guidelines, covering SOPs, batch records, and
                        protocols. All documents are centrally managed and
                        regularly updated, while staff receive ongoing training
                        to maintain compliance and efficiency.
                    </p>
                    <p>
                        We follow strong GMP practices, including process
                        validation, hygiene control, and equipment calibration.
                        Risk management tools like FMEA are used to assess and
                        reduce quality risks. The QA department also oversees
                        change control, deviation handling, and implements
                        Corrective and Preventive Actions (CAPA) to maintain
                        product quality and compliance.
                    </p>
                    <p>
                        Regular audits, supplier validation, and continuous
                        improvement initiatives ensure our processes remain
                        effective and aligned with regulatory standards. QA
                        plays a central role in upholding the safety, quality,
                        and reliability of all Max Pharma products.
                    </p>
                </div>
                <div className='lg:w-4/10'>
                    <GalleryCard />
                </div>
            </div>
        </section>
    );
};

export default page;
