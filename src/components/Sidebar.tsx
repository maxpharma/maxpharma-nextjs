'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown, ChevronRight } from 'lucide-react';

import { menuItems } from '@/utils/data';
import SvgIcon from './SvgIcon';
import { dashboardIcon } from '@/assets/svg';

const Sidebar: React.FC = () => {
    const pathname = usePathname();
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Toggle submenu expansion
    const toggleSubMenu = (id: string) => {
        setExpandedItem(expandedItem === id ? null : id);
    };

    // Toggle sidebar collapse
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
        // Close any open submenus when collapsing
        if (!isCollapsed) {
            setExpandedItem(null);
        }
    };

    // Check if the current path matches the menu item path
    const isActive = (path: string) => {
        return pathname === path;
    };

    // Check if any child of a parent menu is active
    const isChildActive = (children: any[]) => {
        return children.some((child) => isActive(child.path));
    };

    return (
        <div
            className={`${
                isCollapsed ? 'w-16' : 'w-64'
            } h-screen bg-white border-r border-gray-200 pt-6 pb-3 flex flex-col transition-all duration-300 ease-in-out`}
        >
            {/* Header with Logo and Toggle Button */}
            <div
                className={`px-4 mb-6 flex ${
                    isCollapsed ? 'justify-center' : 'justify-between'
                } items-center`}
            >
                {!isCollapsed && (
                    <Image
                        src='/images/logo.png'
                        alt='logo'
                        width={150}
                        height={40}
                        className='object-contain'
                    />
                )}
                <button
                    onClick={toggleSidebar}
                    className='p-1 rounded-md hover:bg-gray-100 text-gray-500 cursor-pointer'
                    aria-label='Toggle sidebar'
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Menu Items */}
            <div className='flex-grow overflow-y-auto scrollbar-hide'>
                <ul className='space-y-1'>
                    {menuItems.map((item) => {
                        const isItemActive = item.children
                            ? isChildActive(item.children)
                            : isActive(item.path);

                        return (
                            <li key={item.id}>
                                {item.children ? (
                                    <div>
                                        <button
                                            onClick={() =>
                                                toggleSubMenu(item.id)
                                            }
                                            className={`flex items-center w-full ${
                                                isCollapsed
                                                    ? 'px-3 justify-center'
                                                    : 'px-6'
                                            } py-3 text-left cursor-pointer ${
                                                isItemActive ||
                                                expandedItem === item.id
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {/* Icon */}
                                            <span
                                                className={`inline-flex items-center justify-center ${
                                                    isCollapsed ? '' : 'mr-3'
                                                }`}
                                            >
                                                {/* Render the proper icon component based on the item's icon prop */}
                                                {item.icon && (
                                                    // Use dynamic import or proper component reference here
                                                    <SvgIcon
                                                        src={dashboardIcon}
                                                    />
                                                )}
                                            </span>

                                            {!isCollapsed && (
                                                <>
                                                    <span className='text-sm font-medium'>
                                                        {item.title}
                                                    </span>
                                                    <span className='ml-auto'>
                                                        {expandedItem ===
                                                        item.id ? (
                                                            <ChevronDown
                                                                size={16}
                                                            />
                                                        ) : (
                                                            <ChevronRight
                                                                size={16}
                                                            />
                                                        )}
                                                    </span>
                                                </>
                                            )}
                                        </button>

                                        {expandedItem === item.id &&
                                            !isCollapsed && (
                                                <ul className='pl-14 py-1 bg-gray-50'>
                                                    {item.children.map(
                                                        (child) => (
                                                            <li key={child.id}>
                                                                <Link
                                                                    href={
                                                                        child.path
                                                                    }
                                                                    className={`block px-4 py-2 text-sm ${
                                                                        isActive(
                                                                            child.path
                                                                        )
                                                                            ? 'text-blue-600 font-medium'
                                                                            : 'text-gray-600 hover:text-blue-600'
                                                                    }`}
                                                                >
                                                                    {
                                                                        child.title
                                                                    }
                                                                </Link>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            )}
                                    </div>
                                ) : (
                                    <Link
                                        href={item.path}
                                        className={`flex items-center ${
                                            isCollapsed
                                                ? 'px-3 justify-center'
                                                : 'px-6'
                                        } py-3 ${
                                            isActive(item.path)
                                                ? 'bg-blue-50 text-primary'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                        title={isCollapsed ? item.title : ''}
                                    >
                                        <span
                                            className={` w-5 h-5 ${
                                                isCollapsed ? '' : 'mr-3'
                                            }`}
                                        >
                                            {/* Render the icon properly */}
                                            {item.icon && (
                                                <SvgIcon src={item.icon} />
                                            )}
                                        </span>
                                        {!isCollapsed && (
                                            <span className='text-sm font-medium'>
                                                {item.title}
                                            </span>
                                        )}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
