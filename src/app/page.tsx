'use client';

import Banner from '@/components/Banner';
import Button from '@/components/ui/Button';
import { associatesLogos, chairPerson, stakeHoldersLogos } from '@/utils/data';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();

    return (
        <>
            <Banner />
            <div className='custom-container mt-4 flex flex-col gap-4 md:gap-20'>
                {/* Who are we? */}
                <section className='space-y-4 '>
                    <div className='flex max-md:flex-col gap-12 justify-between items-center'>
                        <div>
                            <h1 className='mb-4'>Who are we?</h1>
                            <p className='mb-4'>
                                Prabhu Steels and hydro investment company
                                limited was established as a public company in
                                accordance with Company Act 2063. Without the
                                steel sector, there would be no infrastructure
                                development. In this world, steel and
                                iron-related goods are used to build
                                Skyscrapers, Hydropower, Airports, Bridges,
                                Metro systems, and other structures. This
                                company was established in 2075/02/23 B.S.
                                During the establishment of the company, the
                                target of company was to manufacture and
                                assemble the steels and hydro equipment.
                            </p>
                            <p className='mb-4 max-md:hidden'>
                                As there was huge crisis of quality raw
                                materials of steels and no any reliable sources
                                of raw materials the company had faced the
                                lacking of raw goods.  Due to the condition of
                                raw material crisis the company was dependent to
                                foreign resources.  Furthermore, there is no
                                certainty of quality production of steel goods
                                and supply of hydro equipment. By this condition
                                the investment of company was guided towards the
                                different sectors such as Hydropower, Hotel and
                                Tourism, Real state, Cable car, Stock Market,
                                warehouse etc. Recently the company has decided
                                to shift the company towards the investment in
                                steels and Hydro. During the fiscal year 2080/81
                                the company had invested in Siddartha Cablecar
                                Project, Badimalika Cablecar, Ichchhakamana
                                Cablecar Project and three different hydro
                                projects. Company has purchased 227812 sq. ft.
                                land near by Birjung Dry port for the purpose of
                                Warehouse.
                            </p>
                        </div>
                        <div className=' mx-auto'>
                            <div className='flex max-md:justify-around gap-8 '>
                                {chairPerson.map((person, index) => (
                                    <div
                                        key={index}
                                        className='flex flex-col justify-center items-center gap-4 my-4 bg-light-blue px-4 py-12 rounded-lg w-64'
                                    >
                                        <div className='w-[120px] h-[120px] relative'>
                                            <Image
                                                src={person.image}
                                                alt={person.name}
                                                fill
                                                className='object-cover rounded-full'
                                            />
                                        </div>
                                        <div className='flex flex-col gap-1 items-center text-center'>
                                            <h3 className='whitespace-nowrap'>
                                                {person.name}
                                            </h3>
                                            <p>{person.position}</p>
                                            <p>{person.contact}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='bg-light-green px-4 py-6 rounded-lg space-y-4'>
                        <h2>Our Vision</h2>
                        <ul className='list-disc pl-5 space-y-4'>
                            <li className='marker:text-secondary'>
                                <p>
                                    To be a global leader in the import and
                                    export of high-quality steel products and
                                    provide innovative solutions to meet the
                                    evolving needs of customers in various
                                    industries.
                                </p>
                            </li>
                            <li className='marker:text-secondary'>
                                <p>
                                    To create a safe and fulfilling work
                                    environment for employees and contribute to
                                    the economic development of the communities
                                    where the company operates.
                                </p>
                            </li>
                        </ul>
                    </div>
                    <Button
                        onClick={() => {
                            router.push('/about');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        Learn More
                    </Button>
                </section>

                {/* Our major stake holders */}
                <section className='bg-green-50 py-4 lg:py-8 rounded-lg'>
                    <div className='flex flex-col items-center gap-4 md:gap-16 py-8 px-4 md:px-16'>
                        <div>
                            <h2 className='text-green-600 text-2xl font-bold'>
                                Our Major Stake Holders
                            </h2>
                        </div>
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-12  lg:gap-12'>
                            {stakeHoldersLogos.map((logo, index) => (
                                <div key={index} className='relative'>
                                    <div className='bg-white flex justify-center items-center gap-4 p-4 border border-gray-200 rounded-lg max-w-80 mx-auto'>
                                        <div className=' w-[120px] h-[50px] md:w-[250px] md:h-[100px] relative'>
                                            <Image
                                                src={logo.image}
                                                alt={logo.name}
                                                fill
                                                className='object-contain'
                                            />
                                        </div>
                                    </div>
                                    <div className='absolute left-4 -bottom-8'>
                                        <Button
                                            onClick={() =>
                                                logo?.link &&
                                                window.open(logo.link, '_blank')
                                            }
                                        >
                                            {logo?.link === null
                                                ? 'Coming Soon'
                                                : 'Visit Website'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Request of Share Apply */}
                <section className='bg-light-blue py-4 rounded-lg'>
                    <div className='flex flex-col items-center gap-4  py-8 px-4 md:px-16 '>
                        <h1>Request of Share Apply</h1>
                        <p className='text-center'>
                            Download the Share Form and Fill It Properly &
                            Upload with Name and Mobile Number to Us Request of
                            share Invest Applicaition
                        </p>
                        <Button
                            onClick={() => {
                                router.push('/request-share');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        >
                            Apply Now
                        </Button>
                    </div>
                </section>

                {/* Our Associates */}
                <section className='bg-light-green rounded-lg'>
                    <div className='flex flex-col items-center gap-4 md:gap-8 py-8 px-4 '>
                        <div>
                            <h2 className='text-green-600 text-2xl font-bold'>
                                Our Associates
                            </h2>
                        </div>
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12  lg:gap-12'>
                            {associatesLogos.map((logo, index) => (
                                <div
                                    key={index}
                                    className=' w-[120px] h-[50px] md:w-[250px] md:h-[100px] relative'
                                >
                                    <Image
                                        src={logo.image}
                                        alt={logo.name}
                                        fill
                                        className='object-contain'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Map */}
                <section>
                    <div className='relative h-50 md:h-200 w-auto'>
                        <Image
                            src={'/images/map.png'}
                            alt='contact-us'
                            fill
                            className='object-contain'
                        />
                    </div>
                </section>
            </div>
        </>
    );
};

export default Page;
