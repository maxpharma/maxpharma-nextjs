import React from 'react';
import SvgIcon from './SvgIcon';

interface StatsCardProps {
    icon: string;
    title: string;
    value: number | string;
    iconBgColor: string;
    iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
    icon,
    title,
    value,
    iconBgColor,
}) => {
    return (
        <div className='bg-white rounded-lg shadow-sm p-4 '>
            <div className='flex items-center justify-between'>
                <div
                    className={`${iconBgColor} w-10 h-10 rounded-lg flex items-center justify-center mr-4`}
                >
                    <SvgIcon src={icon} />
                </div>
                <div className='text-xl font-semibold text-gray-800'>
                    {value}
                </div>
            </div>
            <span className='text-gray-600 text-sm font-medium'>{title}</span>
        </div>
    );
};

interface StatsGridProps {
    stats: {
        title: string;
        value: number | string;
        icon: string;
        iconBgColor: string;
        iconColor: string;
    }[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {stats.map((stat, index) => (
                <StatsCard
                    key={index}
                    icon={stat.icon}
                    title={stat.title}
                    value={stat.value}
                    iconBgColor={stat.iconBgColor}
                    iconColor={stat.iconColor}
                />
            ))}
        </div>
    );
};

export default StatsGrid;
