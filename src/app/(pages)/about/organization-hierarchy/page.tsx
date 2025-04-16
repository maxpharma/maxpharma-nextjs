"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

interface OrgNodeData {
    name?: string;
    title: string;
    img?: string;
    children?: OrgNodeData[];
    layout?: "horizontal" | "vertical"; // Controls child layout direction
    childLayout?: "horizontal" | "vertical"; // Controls grandchild layout direction
}

interface OrgChartProps {
    data: OrgNodeData;
}

const OrgChart: React.FC<OrgChartProps> = ({ data }) => {
    return (
        <div className='w-full overflow-x-auto py-8'>
            <div className='min-w-fit mx-auto'>
                <OrgNode node={data} level={0} isRoot={true} />
            </div>
        </div>
    );
};

interface OrgNodeProps {
    node: OrgNodeData;
    level: number;
    isRoot?: boolean;
}

const OrgNode: React.FC<OrgNodeProps> = ({ node, level, isRoot = false }) => {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = node.children && node.children.length > 0;
    const layout = node.layout || "vertical";

    const getCardColor = (): string => {
        if (level === 0) return "bg-yellow-50"; // CEO

        // General Manager
        if (node.title === "General Manager") return "bg-blue-50";

        // Children of General Manager (level 2) - each with different color
        if (node.title === "Factory Head") return "bg-red-100";
        if (node.title === "Country Manager") return "bg-green-100";
        if (node.title === "Admin Incharge") return "bg-purple-100";

        // Children of Factory Head - inherit parent color
        if (
            node.title.includes("Procurement") ||
            node.title.includes("Production") ||
            node.title.includes("Quality Assurance") ||
            node.title.includes("HR Manager")
        )
            return "bg-red-100";

        // Children of Country Manager - inherit parent color
        if (
            node.title.includes("Manager-1") ||
            node.title.includes("Manager-2") ||
            node.title.includes("Manager-3") ||
            node.title === "HQ"
        )
            return "bg-green-100";

        // Children of Admin Incharge - inherit parent color
        if (
            node.title.includes("Accountant") ||
            node.title.includes("Inventory") ||
            node.title.includes("HR") ||
            node.title.includes("Office")
        )
            return "bg-purple-100";

        return "bg-pink-50"; // Default color
    };

    const toggleExpand = () => {
        if (hasChildren) {
            setExpanded(!expanded);
        }
    };

    return (
        <div className='flex flex-col items-center'>
            <div
                className={`${getCardColor()} ${
                    !hasChildren && "text-center"
                } max-sm:w-80 rounded-lg shadow-sm p-2 flex items-center gap-2 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
                onClick={toggleExpand}
                style={{ minWidth: "180px" }}
            >
                {node.img && (
                    <div className='w-12 h-12 rounded-tl-xl rounded-br-xl bg-gray-200 overflow-hidden flex-shrink-0'>
                        <Image
                            src={node.img}
                            alt={node.title}
                            width={48}
                            height={48}
                            className='object-cover'
                        />
                    </div>
                )}
                <div className='flex-1'>
                    <div className='font-medium text-sm'>{node.name}</div>
                    <div className='text-xs text-gray-600'>{node.title}</div>
                </div>
                {hasChildren && (
                    <div className='text-gray-400'>
                        <ChevronDown
                            className={`${
                                expanded ? "rotate-180" : ""
                            } transition-transform duration-300`}
                        />
                    </div>
                )}
            </div>

            {hasChildren && expanded && (
                <div className='pt-6 w-full'>
                    {node.children && node.children.length > 0 && (
                        <div className='h-8 w-px bg-gray-300 mx-auto'></div>
                    )}

                    {/* Horizontal layout with connector lines */}
                    {layout === "horizontal" &&
                        node.children &&
                        node.children.length > 0 && (
                            <div className='relative flex justify-center'>
                                {/* Horizontal line connecting all children */}
                                <div
                                    className='absolute top-0 h-px bg-gray-300'
                                    style={{
                                        width: `calc(100% - 200px)`,
                                        maxWidth: `${
                                            (node.children.length - 1) * 280
                                        }px`,
                                    }}
                                ></div>

                                {/* Vertical lines down from horizontal line */}
                                <div
                                    className='flex justify-between w-full'
                                    style={{
                                        maxWidth: `${
                                            node.children.length * 280
                                        }px`,
                                    }}
                                >
                                    {node.children.map((_, index) => (
                                        <div
                                            key={index}
                                            className='flex flex-col items-center'
                                        >
                                            <div className='h-6 w-px bg-gray-300'></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    <div
                        className={`flex ${
                            layout === "vertical"
                                ? "flex-col"
                                : "flex-wrap justify-center"
                        } ${
                            layout === "vertical"
                                ? "gap-y-6"
                                : "gap-x-8 gap-y-12"
                        } pt-2`}
                    >
                        {node.children?.map((child) => (
                            <div
                                key={child.title}
                                className={`flex flex-col items-center ${
                                    layout === "vertical" ? "w-full" : ""
                                }`}
                            >
                                {layout === "vertical" && (
                                    <div className='h-8 w-px bg-gray-300 mb-2'></div>
                                )}
                                <OrgNode node={child} level={level + 1} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const OrganizationChartPage: React.FC = () => {
    const orgData: OrgNodeData = {
        name: "O.P Sah",
        title: "Chairperson/CEO",
        img: "/images/opsah.jpg",
        children: [
            {
                name: "Shishir Sharma Neupane",
                title: "General Manager",
                img: "/images/shishir.jpg",
                layout: "horizontal",
                children: [
                    {
                        title: "Factory Head",
                        layout: "vertical",
                        children: [
                            {
                                title: "Procurement Head",
                            },
                            {
                                title: "Production Head",
                            },
                            {
                                title: "HR Manager",
                            },
                            {
                                title: "Quality Assurance Head",
                            },
                        ],
                    },
                    {
                        title: "Country Manager",
                        layout: "horizontal",
                        children: [
                            {
                                name: "Regional",
                                title: "Manager-1",

                                layout: "vertical",
                                children: [
                                    {
                                        name: "Kathmandu",
                                        title: "HQ",
                                    },
                                    {
                                        name: "Kathmandu",
                                        title: "HQ",
                                    },
                                    {
                                        name: "Kathmandu",
                                        title: "HQ",
                                    },
                                    {
                                        name: "Kathmandu",
                                        title: "HQ",
                                    },
                                    {
                                        name: "Kathmandu",
                                        title: "HQ",
                                    },
                                ],
                            },
                            {
                                name: "Regional",
                                title: "Manager-2",

                                layout: "vertical",
                                children: [
                                    {
                                        name: "Nepalgunj",
                                        title: "HQ",
                                    },
                                    {
                                        name: "Butwal",
                                        title: "HQ",
                                    },
                                    {
                                        name: "Narayanghat",
                                        title: "HQ",
                                    },
                                    {
                                        name: "Pokhara",
                                        title: "HQ",
                                    },
                                ],
                            },
                            {
                                name: "Regional",
                                title: "Manager-3",

                                layout: "vertical",
                                children: [
                                    {
                                        name: "Biratnagar",
                                        title: "HQ",
                                    },
                                    {
                                        name: "Dharan",
                                        title: "HQ",
                                    },
                                    {
                                        name: "Janakpur",
                                        title: "HQ",
                                    },
                                    {
                                        name: "Birgunj",
                                        title: "HQ",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        title: "Admin Incharge",
                        layout: "vertical",
                        children: [
                            {
                                title: "Accountant",
                            },
                            {
                                title: "Inventory Manager",
                            },
                            {
                                title: "HR Officer",
                            },
                            {
                                title: "Office Assistant",
                            },
                        ],
                    },
                ],
            },
        ],
    };

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='text-2xl font-bold text-center mb-8'>
                Organization Chart
            </h1>
            <OrgChart data={orgData} />
        </div>
    );
};

export default OrganizationChartPage;
