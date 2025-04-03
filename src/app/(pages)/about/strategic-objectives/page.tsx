import { fetchByKey } from '@/utils/fetch';
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';

export async function generateMetadata(): Promise<Metadata> {
    const data: any = await fetchByKey('strategicObjectivesSeo');

    const parsedData = JSON.parse(data?.value || '{}');

    return {
        title: {
            default: parsedData?.title || 'checks',
            template: '%s | Prabhu Steels',
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
                        <h1>Objectives</h1>
                        <p>
                            The objective of Prabhu Steels and Hydro Investment
                            Company Limited is to import and export of steel
                            products and supply it for the differnt projects and
                            invest in the Hydro sector. 
                        </p>

                        <div className='w-[250px] md:w-[400px] md:hidden mx-auto'>
                            <Image
                                src='/svg/strategic-image.svg'
                                alt='success'
                                width={400}
                                height={400}
                            />
                        </div>

                        <div className='flex flex-col gap-4 p-4 rounded-lg bg-light-green'>
                            <h4>
                                The main objectives of Prabhu Steels and Hydro
                                Investment Company Limited are:
                            </h4>
                            <ul className='list-disc pl-5 space-y-4'>
                                <li className='marker:text-secondary'>
                                    <p>
                                        Investing in Steels and Hydro Sectors.
                                    </p>
                                </li>
                                <li className='marker:text-secondary'>
                                    <p>
                                        Handling the import and export of steels
                                        and steel goods produced by various
                                        companies for the project such as
                                        hydropower, cable car, skybridge,
                                        suspension bridge.
                                    </p>
                                </li>
                                <li className='marker:text-secondary'>
                                    <p>
                                        Investing in the field of Information
                                        technology and Overall technology.
                                    </p>
                                </li>
                                <li className='marker:text-secondary'>
                                    <p>Meeting Customer demands.</p>
                                </li>
                            </ul>
                        </div>
                        <div className='p-4 bg-light-blue rounded-lg'>
                            <p>
                                Overall, the Objective of Prabhu Steels and
                                Hydro Investment Company Limited is to invest in
                                the sector of  steel products and Hydro
                                sectors. 
                            </p>
                        </div>
                    </div>
                    <div className='w-[400px] max-md:hidden'>
                        <Image
                            src='/svg/strategic-image.svg'
                            alt='success'
                            width={400}
                            height={400}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default page;
