'use client';

import Team from '@/api/team';
import Image from 'next/image';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

// Define interfaces for your data structure
interface DirectorAdditionalInfo {
    name?: string;
    role?: string;
    companyName?: string;
}

interface Director {
    id: number;
    type: string;
    image: string;
    additionalInfo: DirectorAdditionalInfo;
    createdAt: string;
}

interface DirectorsState {
    items: Director[];
}

interface RootState {
    directors: DirectorsState;
}

const BoardOfDirectors = () => {
    const fetchData = async () => {
        await Team.getData('directors', 'directors');
    };

    const { items: originalDirectorsData = [] } = useSelector(
        (state: RootState) => state.directors || { items: [] }
    );
    
    // Reverse the directors data array
    const directorsData = [...originalDirectorsData].reverse();

    useEffect(() => {
        fetchData();
    }, []);

    // No data yet or empty data case
    if (!directorsData || directorsData.length === 0) {
        return (
            <div className='container mx-auto py-12 px-4'>
                <h1 className='text-3xl font-bold text-center mb-12'>
                    Board of Directors
                </h1>
                <p className='text-center'>Loading directors information...</p>
            </div>
        );
    }

    // Function to render a director card
    const renderDirectorCard = (member: Director) => (
        <div className='flex flex-col items-center'>
            <div className='w-32 h-32 rounded-full overflow-hidden mb-4'>
                <Image
                    src={`${process.env.NEXT_PUBLIC_BUCKET_URL}/${member.image}`}
                    alt={member.additionalInfo?.name || 'Board Member'}
                    width={128}
                    height={128}
                    className='object-cover'
                />
            </div>
            <h3 className='font-bold text-center text-primary'>
                {member.additionalInfo?.name || ''}
            </h3>
            <p className='text-center text-primary font-medium'>
                {member.additionalInfo?.role || ''}
            </p>
            <p className='text-center text-green-600 text-sm max-w-xs'>
                {member.additionalInfo?.companyName || ''}
            </p>
        </div>
    );

    const isEven = directorsData.length % 2 === 0;

    // Create the layout based on the number of items
    let firstRow: Director[] = [];
    let middleRows: Director[] = [];
    let lastRow: Director[] = [];

    // First item always goes at the top
    firstRow = [directorsData[0]];

    // For even number of directors, last item goes at the bottom
    if (isEven && directorsData.length > 1) {
        middleRows = directorsData.slice(1, directorsData.length - 1);
        lastRow = [directorsData[directorsData.length - 1]];
    } else {
        // For odd number, all remaining items go in the middle rows
        middleRows = directorsData.slice(1);
        lastRow = [];
    }

    // Pair up the middle rows
    const pairedRows: Director[][] = [];
    for (let i = 0; i < middleRows.length; i += 2) {
        if (i + 1 < middleRows.length) {
            // If there's a pair, add both
            pairedRows.push([middleRows[i], middleRows[i + 1]]);
        } else {
            // If there's an odd one left, add just one
            pairedRows.push([middleRows[i]]);
        }
    }

    return (
        <div className='container mx-auto py-12 px-4'>
            <h1 className='text-3xl font-bold text-center mb-12'>
                Board of Directors
            </h1>

            {/* First row - Top Center (Always) */}
            {firstRow.length > 0 && (
                <div className='flex justify-center mb-16'>
                    {renderDirectorCard(firstRow[0])}
                </div>
            )}

            {/* Middle rows - Two items per row */}
            {pairedRows.map((pair, rowIndex) => (
                <div
                    key={`row-${rowIndex}`}
                    className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-16'
                >
                    {pair.map((member, memberIndex) => (
                        <div
                            key={`member-${rowIndex}-${memberIndex}`}
                            className='flex justify-center'
                        >
                            {renderDirectorCard(member)}
                        </div>
                    ))}
                </div>
            ))}

            {/* Last row - Bottom Center (Only for even number of items) */}
            {lastRow.length > 0 && (
                <div className='flex justify-center'>
                    {renderDirectorCard(lastRow[0])}
                </div>
            )}
        </div>
    );
};

export default BoardOfDirectors;
