import GalleryCard from "@/features/GalleryCard";
import React from "react";

const page = () => {
    return (
        <section>
            <div className='flex flex-col lg:flex-row gap-4 lg:gap-12 lg:items-center'>
                <div className='w-full lg:w-6/10 flex flex-col gap-2 md:gap-6'>
                    <h1>Research & Development</h1>
                    <p>
                        At Max Pharma Pvt. Ltd., the product development process
                        begins with the R&D department receiving a product
                        proposal or brief from the marketing team. This triggers
                        a feasibility study, where the R&D team gathers detailed
                        information from various reliable sources, including IP,
                        BP, USP, and other reference materials like BMF, Mark
                        Index, and Martindale.
                    </p>
                    <p>
                        The next step involves summarizing key data relevant to
                        formulation in the preformulation study. The team
                        discusses this information, often in a meeting, to
                        finalize the formulation strategy. Market samples,
                        particularly from patent manufacturers or leading
                        brands, are obtained to assess the physical parameters
                        and set specifications for the final product.
                    </p>
                    <p>
                        The pharmacopoeia claims for both the raw materials and
                        finished product are discussed with the Quality Control
                        (QC) department to ensure they meet regulatory
                        standards. Once the availability of active ingredients
                        and excipients is confirmed, materials are ordered from
                        approved vendors.
                    </p>
                    <p>
                        With the necessary materials in hand, the team proceeds
                        with trial batches to determine the most effective
                        formulation. These trial batches are sent to QC for
                        analysis. The formulation that best aligns with the
                        desired specifications is finalized. Subsequently, the
                        Batch Manufacturing Record (BMR) is prepared, and three
                        batches are produced using the same formulation and
                        procedure.
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
