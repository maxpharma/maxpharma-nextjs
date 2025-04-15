import GalleryCard from "@/features/GalleryCard";
import React from "react";

const page = () => {
  return (
    <section>
      <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
        <div className="w-full lg:w-6/10 flex flex-col gap-2 md:gap-6">
          <h1>About Us</h1>
          <p>
            At Max Pharma Pvt. Ltd., we manufacture a wide range of
            pharmaceutical products in state-of-the-art facilities, each
            designed for specific dosage forms to ensure quality, safety, and
            compliance. We produce various types of tablets, including chewable,
            dispersible, and sustained-release, using advanced compression and
            coating equipment to ensure consistency and therapeutic
            effectiveness. Our capsule production includes both hard gelatin
            capsules for powders and soft gelatin capsules for oil-based
            formulations, all prepared in controlled environments for optimal
            stability.
          </p>
          <p>
            Our syrup section formulates liquid medications like antipyretics,
            expectorants, and multivitamins, with high-precision mixing and
            bottling under hygienic conditions. We also produce ointments in
            dedicated areas, ensuring smooth texture and even drug distribution
            for topical treatments. Additionally, we manufacture sachets for
            powders and oral rehydration salts (ORS), using airtight packaging
            for accurate dosing and extended shelf life. Each product is
            subjected to rigorous quality checks, reflecting our commitment to
            delivering reliable and accessible medicines across Nepal.
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
