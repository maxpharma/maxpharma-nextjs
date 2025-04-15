import GalleryCard from "@/features/GalleryCard";
import React from "react";

const page = () => {
  return (
    <section>
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-6/10 flex flex-col gap-2 md:gap-6">
          <h1>Quality Control</h1>
          <p>
            At Max Pharma Pvt. Ltd., quality control is integral to every stage
            of production. We conduct thorough sampling and testing of incoming
            raw materials, in-process samples, water, and finished products in
            compliance with IP, BP, USP, and in-house specifications. Raw and
            packaging materials are approved only after meeting strict testing
            and in-process check standards.
          </p>
          <p>
            Our QC team ensures proper hygiene, cleanliness, and instrument
            calibration, and participates in the validation of products and
            cleaning procedures. We closely monitor product stability throughout
            its shelf life and maintain retain samples for periodic testing.
          </p>
          <p>
            We follow clear procedures for managing quality complaints, disposal
            of rejected materials, and documenting reprocessed batches to
            prevent recurrence. Hold time studies are conducted for bulk
            products, and regular training keeps staff updated with current
            quality standards. All relevant documents are preserved for at least
            one year after expiry, ensuring traceability and regulatory
            compliance.
          </p>
        </div>
        <div className="lg:w-4/10">
          <GalleryCard />
        </div>
      </div>
    </section>
  );
};

export default page;
