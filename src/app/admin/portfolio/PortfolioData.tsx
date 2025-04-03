import Portfolio from '@/api/portfolio';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import DataTable from '@/components/DataTable';
import SvgIcon from '@/components/SvgIcon';
import { deleteIcon, editIcon } from '@/assets/svg';
import CustomImage from '@/components/CustomImage';
import ConfirmationAlert from '@/components/ConfirmationAlert';
import { PortfolioType } from './page';

interface PortfolioItem {
    id: number;
    title: string;
    type: string;
    file: string;
    createdAt: string;
    updatedAt: string;
    // Add other fields as needed
}

interface PortfolioDataProps {
    setUpdateIdData: Dispatch<SetStateAction<PortfolioType | null>>;
}

const PortfolioList: React.FC<PortfolioDataProps> = ({ setUpdateIdData }) => {
    const { items: portfolioData = [] } = useSelector(
        (state: any) => state.portfolio || { items: [] }
    );

    const [activeType, setActiveType] = useState<string>('all');

    const fetchData = async () => {
        await Portfolio.getList('portfolio');
    };

    useEffect(() => {
        if (!portfolioData?.length) {
            fetchData();
        }
    }, [portfolioData?.length]);

    // Extract unique portfolio types with proper type safety
    const portfolioTypes: string[] = React.useMemo(() => {
        if (
            !portfolioData ||
            !Array.isArray(portfolioData) ||
            portfolioData.length === 0
        ) {
            return ['all'];
        }

        const types = new Set<string>();
        types.add('all');

        portfolioData.forEach((item: PortfolioItem) => {
            if (item && item.type && typeof item.type === 'string') {
                types.add(item.type);
            }
        });

        return Array.from(types);
    }, [portfolioData]);

    // Define columns structure
    const columns = [
        { id: 'title', header: 'Title', accessor: 'title', minWidth: 170 },
        { id: 'image', header: 'Image', accessor: 'image', minWidth: 170 },
        {
            id: 'action',
            header: 'Actions',
            accessor: 'action',
            minWidth: 170,
        },
    ];

    // Filter data based on active type and create rows
    const rows = React.useMemo(() => {
        if (!portfolioData || !Array.isArray(portfolioData)) {
            return [];
        }

        return portfolioData
            .filter(
                (item: PortfolioItem) =>
                    activeType === 'all' || item.type === activeType
            )
            .map((item: PortfolioItem) => {
                return {
                    id: item.id,
                    title: item.title,
                    image: (
                        <CustomImage
                            src={`${process.env.NEXT_PUBLIC_BUCKET_URL}/${item?.file}`}
                            size='small'
                            orientation='landscape'
                        />
                    ),
                    action: (
                        <div className='flex space-x-2'>
                            <button
                                className='cursor-pointer'
                                onClick={() =>
                                    setUpdateIdData({
                                        id: item.id,
                                        title: item.title,
                                        type: item.type,
                                        file: item.file,
                                    })
                                }
                            >
                                <SvgIcon src={editIcon} />
                            </button>
                            <button
                                className='text-red-500 hover:text-red-700 cursor-pointer'
                                onClick={() => handleDeleteClick(item.id)}
                            >
                                <SvgIcon src={deleteIcon} />
                            </button>
                        </div>
                    ),
                    type: item.type,
                    createdAt: new Date(item.createdAt).toLocaleDateString(),
                };
            });
    }, [portfolioData, activeType]);

    // Handle type filter change
    const handleTypeChange = (type: string) => {
        setActiveType(type);
    };

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setItemToDelete(id);
        setShowConfirmation(true);
    };

    const handleDelete = async () => {
        if (itemToDelete !== null) {
            await Portfolio.deleteItem(itemToDelete);
            setShowConfirmation(false);
            // Optionally refresh the data
            fetchData();
        }
    };

    return (
        <>
            <div className='space-y-6 mt-12'>
                <div className='flex flex-row flex-wrap gap-2'>
                    {portfolioTypes.map((type) => (
                        <button
                            key={type}
                            className={`px-4 py-2 rounded-full text-sm ${
                                activeType === type
                                    ? 'active-button'
                                    : 'inactive-button'
                            }`}
                            onClick={() => handleTypeChange(type)}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>

                <DataTable
                    title='Portfolio'
                    columns={columns}
                    data={rows}
                    emptyMessage='No portfolio found'
                />
            </div>
            {showConfirmation && (
                <ConfirmationAlert
                    message='Are you Sure you want to Delete This Data ?'
                    confirmText='YES'
                    cancelText='NO'
                    onConfirm={() => handleDelete()} // Pass as a function reference
                    onCancel={() => setShowConfirmation(false)}
                />
            )}
        </>
    );
};

export default PortfolioList;
