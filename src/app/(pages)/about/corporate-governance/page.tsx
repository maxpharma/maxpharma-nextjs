import { fetchByKey } from '@/utils/fetch';
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react';

export async function generateMetadata(): Promise<Metadata> {
    const data: any = await fetchByKey('corporateGovernanceSeo');

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
                <div className='flex justify-between '>
                    <div className='w-full md:w-3/5 flex flex-col gap-2 md:gap-6'>
                        <h1>Corporate Governance</h1>
                        <p>
                            Prabhu Steels and Hydro Investment Company
                            Limited refers to the system of rules, practices,
                            and processes by which the company is directed,
                            controlled, and managed. Effective corporate
                            governance is essential to ensure that the company
                            operates in a transparent and ethical manner, and
                            that it meets the expectations of stakeholders,
                            including shareholders, customers, employees, and
                            the broader community.
                        </p>

                        <div className='w-[250px] md:w-[400px] md:hidden mx-auto'>
                            <Image
                                src='/svg/corporate-image.svg'
                                alt='success'
                                width={400}
                                height={400}
                            />
                        </div>

                        <div className='flex flex-col gap-4 p-4 rounded-lg bg-light-blue'>
                            <h3>Accountability and transparency:</h3>
                            <ul className='list-disc pl-5 space-y-4'>
                                <li className='marker:text-primary'>
                                    <p>
                                        The board of directors and senior
                                        management of Prabhu Steels and Hydro
                                        Investment Company Limited are
                                        accountable to shareholders and other
                                        stakeholders for their actions,
                                        decisions, and performance. They are
                                        operating in a transparent manner,
                                        providing regular and timely disclosure
                                        of relevant information.
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <div className='flex flex-col gap-4 p-4 rounded-lg bg-light-blue'>
                            <h3>Strategic direction and performance:</h3>
                            <ul className='list-disc pl-5 space-y-4'>
                                <li className='marker:text-primary'>
                                    <p>
                                        The board of directors and senior
                                        management had set the strategic
                                        direction of the company and monitor its
                                        performance against established goals
                                        and objectives. They have ensured that
                                        the company operates in a financially
                                        sustainable manner and creates long-term
                                        value for shareholders.
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <div className='flex flex-col gap-4 p-4 rounded-lg bg-light-blue'>
                            <h3>Risk management:</h3>
                            <ul className='list-disc pl-5 space-y-4'>
                                <li className='marker:text-primary'>
                                    <p>
                                        Prabhu Steels and Hydro Investment
                                        Company Limited operate in a complex and
                                        dynamic environment, and face a range of
                                        risks, including operational, financial,
                                        legal, and reputational risks. The board
                                        of directors and senior management had
                                        identified and manage these risks
                                        effectively to protect the interests of
                                        shareholders and other stakeholders.
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <div className='flex flex-col gap-4 p-4 rounded-lg bg-light-blue'>
                            <h3>Stakeholder engagement:</h3>
                            <ul className='list-disc pl-5 space-y-4'>
                                <li className='marker:text-primary'>
                                    <p>
                                        Prabhu Steels and Hydro Investment
                                        Company Limited had engage with their
                                        stakeholders in a meaningful and
                                        constructive manner, taking into account
                                        their interests and concerns. This
                                        includes employees, customers,
                                        suppliers, regulators, and the broader
                                        community.
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <div className='flex flex-col gap-4 p-4 rounded-lg bg-light-blue'>
                            <h3>Ethical behavior and social responsibility:</h3>
                            <ul className='list-disc pl-5 space-y-4'>
                                <li className='marker:text-primary'>
                                    <p>
                                        Prabhu Steels and Hydro Investment
                                        Company Limited had operated in an
                                        ethical and socially responsible manner,
                                        respecting human rights, labor
                                        standards, and the environment. The
                                        board of directors and senior management
                                        had ensured that the company complies
                                        with applicable laws and regulations,
                                        and adopts best practices in corporate
                                        social responsibility.
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='w-[500px] max-md:hidden'>
                        <Image
                            src='/svg/corporate-image.svg'
                            alt='success'
                            width={500}
                            height={500}
                        />
                    </div>
                </div>
                <div className='p-4 mt-8 bg-light-green rounded-lg'>
                    <p>
                        By promoting accountability, transparency, strategic
                        direction, risk management, stakeholder engagement,
                        ethical behavior, and social responsibility, corporate
                        governance helps to build trust and confidence among
                        stakeholders, and to create long-term value for
                        shareholders.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default page;
