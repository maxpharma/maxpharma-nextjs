import GalleryCard from "@/features/GalleryCard";
import { fetchByKey } from "@/utils/fetch";
import { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const data: any = await fetchByKey("overviewSeo");

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
    <div className="flex flex-col gap-4 md:gap-20">
      <section>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-6/10 flex flex-col gap-2 md:gap-6">
            <h1>About Us</h1>
            <p>
              Max Pharma Pvt. Ltd, based in Bagdurbar, Sundhara, Kathmandu,
              Nepal, has been a well-established and trusted name in the
              pharmaceutical industry for over 22 years. We have built our
              foundation by consistently importing high-quality medicines from
              India and distributing them efficiently across all regions of
              Nepal. Our strong nationwide network has helped us reach even the
              most remote areas, ensuring timely access to essential medicines.
            </p>
            <p>
              One of our key strengths lies in our dedicated core Sales &
              Marketing team, which works tirelessly to promote our products and
              support their effective distribution. This passionate and
              experienced team plays a vital role in maintaining strong
              relationships with healthcare professionals, hospitals, and
              pharmacies, contributing significantly to our continued growth.
            </p>
            <p>
              Looking ahead, we are proud to share that we are in the process of
              establishing our own pharmaceutical manufacturing facility in
              Ishnath-3, Rautahat. Expected to be operational very soon, this
              facility represents a major milestone in our mission to contribute
              to Nepal&apos;s self-reliance in medicine production and to ensure
              affordable, high-quality healthcare solutions for the nation.
            </p>
          </div>
          <div className="lg:w-4/10">
            <GalleryCard />
          </div>
        </div>
      </section>

      <section className="space-y-2 md:space-y-4">
        <h1>Our Vision</h1>
        <p>
          To become a leading force in Nepal’s pharmaceutical industry by
          ensuring nationwide access to high-quality, affordable medicines and
          contributing to the country&apos;s self-reliance in healthcare. 
        </p>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-12">
          <ul className="list-disc list-inside space-y-2 lg:w-7/10 bg-secondary p-4 rounded-xl">
            <h1>Our Mission</h1>
            <li className="marker:text-primary">
              To provide safe, effective, and quality pharmaceutical products to
              people across Nepal.
            </li>
            <li className="marker:text-primary">
              To build a robust supply and distribution network that reaches
              every region, including remote communities.
            </li>
            <li className="marker:text-primary">
              To establish and operate a world-class manufacturing facility that
              meets national and international standards.
            </li>
            <li className="marker:text-primary">
              To maintain strong relationships with healthcare professionals
              through ethical marketing and promotional efforts.
            </li>
          </ul>
          <ul className="list-disc list-inside space-y-2 lg:w-7/10 bg-light-primary p-4 rounded-xl">
            <h1>Our Goal</h1>
            <li className="marker:text-primary">
              Successfully launch our pharmaceutical manufacturing unit in
              Ishnath-3, Rautahat within the next year.
            </li>
            <li className="marker:text-primary">
              Expand our product portfolio to include a wide range of essential
              and specialized medicines.
            </li>
            <li className="marker:text-primary">
              Strengthen our team of professionals through continuous training,
              development and Enhance our distribution network to improve
              efficiency and coverage nationwide.
            </li>
            <li className="marker:text-primary">
              Uphold the highest standards of quality, compliance, and customer
              satisfaction at every stage of our operations
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default page;
