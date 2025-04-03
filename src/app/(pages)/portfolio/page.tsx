'use client';

import Portfolio from '@/api/portfolio';
import CustomImage from '@/components/CustomImage';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const PortfolioPage = () => {
    const [selectedType, setSelectedType] = useState('All');
    const { items: portfolioData } = useSelector(
        (state: any) => state.portfolio
    );

    const fetchData = async () => {
        await Portfolio.getList('portfolio');
    };

    useEffect(() => {
        if (!portfolioData?.length) {
            fetchData();
        }
    }, [portfolioData?.length]);

    const uniqueTypes = Array.from(
        new Set(portfolioData.map((item: any) => item.type))
    );

    const filteredItems =
        selectedType !== 'All'
            ? portfolioData.filter((item: any) => item.type === selectedType)
            : portfolioData;

    // Group items by type when "All" is selected
    const groupedByType: Record<string, any[]> =
        selectedType === 'All'
            ? uniqueTypes.reduce((acc: Record<string, any[]>, type: any) => {
                  acc[type] = portfolioData.filter(
                      (item: any) => item.type === type
                  );
                  return acc;
              }, {})
            : {};

    return (
        <>
            <div className='mx-auto w-[98vw] bg-blue-50 rounded-xl py-8'>
                <div className='px-4 flex flex-col items-center gap-8'>
                    <h1>
                        {selectedType === 'All' ? 'All Projects' : selectedType}
                    </h1>
                    <div className='flex items-center gap-4 flex-wrap justify-center'>
                        <div
                            className={`rounded-lg ${
                                selectedType === 'All'
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-primary hover:bg-blue-100'
                            } px-4 py-2 text-sm font-medium transition duration-200 cursor-pointer`}
                            onClick={() => setSelectedType('All')}
                        >
                            All
                        </div>
                        {uniqueTypes.map((type) => (
                            <div
                                key={String(type)}
                                className={`rounded-lg ${
                                    selectedType === type
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-primary hover:bg-blue-100'
                                } px-4 py-2 text-sm font-medium transition duration-200 cursor-pointer`}
                                onClick={() => setSelectedType(type as string)}
                            >
                                {type as string}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-4 md:gap-12 mt-8'>
                {selectedType === 'All' ? (
                    // Display items grouped by type with headings
                    Object.entries(groupedByType).map(
                        ([type, items]: [string, any]) => (
                            <div key={type} className='mb-8 space-y-8'>
                                <h1 className='text-center text-3xl'>{type}</h1>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-16'>
                                    {items.map((item: any, index: number) => (
                                        <div
                                            key={index}
                                            className='flex flex-col items-center gap-4 md:gap-8 p-4 rounded-lg shadow-lg'
                                        >
                                            <CustomImage
                                                src={`${process.env.NEXT_PUBLIC_BUCKET_URL}/${item?.file}`}
                                                size='small'
                                                orientation='landscape'
                                                className='rounded-lg'
                                            />
                                            <h3 className='font-bold text-center'>
                                                {item.title}
                                            </h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )
                ) : (
                    // Display filtered items without type headings
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-16'>
                        {filteredItems.map((item: any, index: number) => (
                            <div
                                key={index}
                                className='flex flex-col items-center gap-4 md:gap-8 p-4 rounded-lg shadow-lg'
                            >
                                <CustomImage
                                    src={`${process.env.NEXT_PUBLIC_BUCKET_URL}/${item?.file}`}
                                    size='small'
                                    orientation='landscape'
                                    className='rounded-lg'
                                />
                                <h3 className='font-bold text-center'>
                                    {item.title}
                                </h3>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default PortfolioPage;
