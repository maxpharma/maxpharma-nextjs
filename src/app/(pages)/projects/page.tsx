import Image from 'next/image';
import React from 'react';

const page = () => {
    return (
        <>
            <div className='flex justify-between '>
                <div className='w-full md:w-3/5 flex flex-col gap-2 md:gap-6'>
                    <h1>Siddhartha Cable Car</h1>
                    <p>
                        This project is located near the Lord Gautam Buddha’s
                        birthplace. This area is the hermitage of Lord Buddha’s
                        Kulguru and the place where Lord Buddha received his
                        early education. The project is running at the place
                        where Lord Buddha spent his childhood time and Lord
                        Buddha’s childhood name was Siddhartha Gautam so the
                        name of this project has given the Siddhartha Cable Car
                        Project dedicated to the Lord Buddha. This project has
                        been taken as a means of attaining merit by wishing for
                        the blessings and peace of Lord Buddha. It is said that
                        Lord Buddha walked seven steps as soon as he was born.
                        As the symbol of the seven steps of Lord Buddha a lotus
                        park will be built here in the shape of a lotus flower.
                        At the bottom station of the Cable Car project, a
                        footprint has been made on a lotus flower in the form of
                        6 steps.
                    </p>
                </div>
                <div className='w-[250px] md:w-[400px]  mx-auto'>
                    <Image
                        src='/images/cable-car.png'
                        alt='success'
                        width={400}
                        height={400}
                    />
                </div>
            </div>
        </>
    );
};

export default page;
