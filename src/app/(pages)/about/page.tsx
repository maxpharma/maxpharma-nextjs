import { fetchByKey } from '@/utils/fetch';
import { Metadata } from 'next';
import Image from 'next/image';

export async function generateMetadata(): Promise<Metadata> {
    const data: any = await fetchByKey('overviewSeo');

    const parsedData = JSON.parse(data?.value || '{}');

    return {
        title: {
            default:
                parsedData?.title ||
                'checks',
            template: '%s | Prabhu Steels'
        },
        description: parsedData?.description || 'Default description',
        keywords: parsedData?.keywords || 'Default keywords',
        icons: {
            icon: '/logo.ico',
            apple: '/logo.ico',
            shortcut: '/logo.ico',
        },
    };
}

const page = () => {
    return (
        <div className='flex flex-col gap-4 md:gap-20'>
            <section>
                <div className='flex justify-between items-center'>
                    <div className='w-full md:w-3/5 flex flex-col gap-2 md:gap-6'>
                        <h1>About Us</h1>
                        <p>
                            Prabhu Steels and hydro investment company limited
                            was established as a public company in accordance
                            with Company Act 2063. Without the steel sector,
                            there would be no infrastructure development. In
                            this world, steel and iron-related goods are used to
                            build Skyscrapers, Hydropower, Airports, Bridges,
                            Metro systems, and other structures. This company
                            was established in 2075/02/23 B.S. During the
                            establishment of the company, the target of company
                            was to manufacture and assemble the steels and hydro
                            equipment. As there was huge crisis of quality raw
                            materials of steels and no any reliable sources of
                            raw materials the company had faced the lacking of
                            raw goods.  Due to the condition of raw material
                            crisis the company was dependent to foreign
                            resources.
                        </p>
                        <p>
                            Furthermore, there is no certainty of quality
                            production of steel goods and supply of hydro
                            equipment. By this condition the investment of
                            company was guided towards the different sectors
                            such as Hydropower, Hotel and Tourism, Real state,
                            Cable car, Stock Market, warehouse etc. Recently the
                            company has decided to shift the company towards the
                            investment in steels and Hydro. During the fiscal
                            year 2080/81 the company had invested in Siddartha
                            Cablecar Project, Badimalika Cablecar, Ichchhakamana
                            Cablecar Project and three different hydro projects.
                            Company has purchased 227812 sq. ft. land near by
                            Birjung Dry port for the purpose of Warehouse.
                        </p>
                        <div className='w-[250px] md:w-[400px] md:hidden mx-auto'>
                            <Image
                                src='/svg/success.svg'
                                alt='success'
                                width={400}
                                height={400}
                            />
                        </div>
                    </div>
                    <div className='w-[400px] max-md:hidden'>
                        <Image
                            src='/svg/success.svg'
                            alt='success'
                            width={400}
                            height={400}
                        />
                    </div>
                </div>
            </section>

            <section className='bg-light-green p-4 rounded-lg'>
                <p>
                    The authorized capital of the company is 205 crores. Issued
                    capital is 200 crores. 51% share of issued capital will be
                    of the founders. Company has divided the 41,000,000 shares
                    to promoter and public with per share Rs. 50. While issuing
                    the IPO, 10% share of issued capital will be owned by Prabhu
                    Groups employees, 5%  of the share will be allocated for
                    mutual fund and 10%  of the share will be allocated to the
                    Neplease who are in foreign employment. The remaining share
                    will be issued in IPO of general public . Currently, the
                    company’s equity capital is 102 crores. In which Prabhu
                    Holdings and Hydro Development Company Limited has 20% and
                    Prabhu Cablecar and Tourism Limited has more than 32%.
                    Similarly, Hydro Holdings and Power Development Company
                    Limited is above 14% and Prabhu Urja Krishi Paryatan Bikas
                    Limited owns more than 33%. At least 51% stake in this
                    company will remain with Prabhu Groups and Companies. This
                    company is constantly working to guarantee corporate
                    governance to its shareholders and to give high returns to
                    its investors.
                </p>
                <p>
                    By implementing best practices and prioritizing
                    transparency, accountability, and ethical behavior, our
                    company can build trust with shareholders, stakeholders, and
                    the broader community. Our goal is to become the top Steels
                    and Hydro Investment Company of the country.
                </p>
                <p>
                    The directors of this company are only Prabhu Groups
                    representatives. Prabhu Urja Krishi Paryatan Bikas Limited,
                    Hydro Holdings and Power Development Company Limited, Prabhu
                    Holdings and Hydro Development Company Limited an
                    institutional investor of the Prabhu Groups, owns more than
                    92% of this company.
                </p>
            </section>

            <section className='space-y-4 md:space-y-8'>
                <h1>Overview</h1>
                <p>
                    This Steels and Hydro Investment Company in Nepal is key
                    contributor to the nation’s industrial and energy sectors,
                    focusing on import and export of infrastructure materials of
                    Steels and supporting hydropower projects. This company
                    operats at the intersection of Nepal’s push for sustainable
                    development and economic growth by investing in renewable
                    energy sources and industrial production. The business goals
                    of this Company  align with advancing the nation’s
                    industrial and energy sectors.  
                </p>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-8 md:gap-y-4'>
                    <div className='flex flex-col gap-4 p-4 rounded-lg bg-light-blue'>
                        <h3>Promoting Sustainable Energy Development</h3>
                        <ul className='list-disc pl-5 space-y-4'>
                            <li className='marker:text-primary'>
                                <p>
                                    Investing in hydropower projects to harness
                                    Nepal’s vast water resources for clean and
                                    renewable energy production.
                                </p>
                            </li>
                            <li className='marker:text-primary'>
                                <p>
                                    Supporting energy infrastructure such as
                                    power transmission and distribution systems.
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div className='flex flex-col gap-4 p-4 rounded-lg bg-light-blue'>
                        <h3>Enhancing Industrial Capacity:</h3>
                        <ul className='list-disc pl-5 space-y-4'>
                            <li className='marker:text-primary'>
                                <p>
                                    Investing in industry based production and
                                    supplying high-quality steel and
                                    hydro-related equipment for construction and
                                    energy projects.
                                </p>
                            </li>
                            <li className='marker:text-primary'>
                                <p>
                                    Strengtheing the local manufacturing sector
                                    to reduce dependance on imports
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div className='flex flex-col gap-4 p-4 rounded-lg bg-light-blue'>
                        <h3>Driving Economic Growth:</h3>
                        <ul className='list-disc pl-5 space-y-4'>
                            <li className='marker:text-primary'>
                                <p>
                                    Facilitating large-scale infrastructure
                                    projects to boost industrial development and
                                    create employment opportunities
                                </p>
                            </li>
                            <li className='marker:text-primary'>
                                <p>
                                    Attracting domestic and foreign investment
                                    into  energy and industrial sectors.
                                </p>
                            </li>
                        </ul>
                    </div>

                    <div className='flex flex-col gap-4 p-4 rounded-lg bg-light-blue'>
                        <h3>Encouraging Innovation and Efficiency:</h3>
                        <ul className='list-disc pl-5 space-y-4'>
                            <li className='marker:text-primary'>
                                <p>
                                    Adopting advanced technologies for
                                    manufacturing and energy production
                                </p>
                            </li>
                            <li className='marker:text-primary'>
                                <p>
                                    Ensuring efficient resource utilization in
                                    project execution and operations.
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default page;
