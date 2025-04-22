import AboutUs from "@/features/AboutUs";
import { getSeoMetadata } from "@/utils/seo";

export async function generateMetadata() {
    return await getSeoMetadata("overviewSeo");
}

const page = () => {
    return (
        <div className='flex flex-col gap-4 md:gap-20'>
            <AboutUs />

            <section className='space-y-2 md:space-y-4'>
                <h1>Our Vision</h1>
                <p>
                    To become a leading force in Nepal’s pharmaceutical industry
                    by ensuring nationwide access to high-quality, affordable
                    medicines and contributing to the country&apos;s
                    self-reliance in healthcare. 
                </p>

                <div className='flex flex-col lg:flex-row gap-4 lg:gap-12'>
                    <ul className='list-disc list-inside space-y-2 lg:w-7/10 bg-secondary p-4 rounded-xl'>
                        <h1>Our Mission</h1>
                        <li className='marker:text-primary'>
                            To provide safe, effective, and quality
                            pharmaceutical products to people across Nepal.
                        </li>
                        <li className='marker:text-primary'>
                            To build a robust supply and distribution network
                            that reaches every region, including remote
                            communities.
                        </li>
                        <li className='marker:text-primary'>
                            To establish and operate a world-class manufacturing
                            facility that meets national and international
                            standards.
                        </li>
                        <li className='marker:text-primary'>
                            To maintain strong relationships with healthcare
                            professionals through ethical marketing and
                            promotional efforts.
                        </li>
                    </ul>
                    <ul className='list-disc list-inside space-y-2 lg:w-7/10 bg-light-primary p-4 rounded-xl'>
                        <h1>Our Goal</h1>
                        <li className='marker:text-primary'>
                            Successfully launch our pharmaceutical manufacturing
                            unit in Ishnath-3, Rautahat within the next year.
                        </li>
                        <li className='marker:text-primary'>
                            Expand our product portfolio to include a wide range
                            of essential and specialized medicines.
                        </li>
                        <li className='marker:text-primary'>
                            Strengthen our team of professionals through
                            continuous training, development and Enhance our
                            distribution network to improve efficiency and
                            coverage nationwide.
                        </li>
                        <li className='marker:text-primary'>
                            Uphold the highest standards of quality, compliance,
                            and customer satisfaction at every stage of our
                            operations
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
};

export default page;
