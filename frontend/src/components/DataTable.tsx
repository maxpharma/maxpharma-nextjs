import React from "react";

interface Column<T> {
    id?: string;
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode) | string;
    className?: string;
    minWidth?: number;
    maxWidth?: number;
}

interface Action<T> {
    label: string;
    buttonStyle?: string;
    onClick: (row: T) => void;
}

interface DataTableProps<T> {
    title: string;
    columns: Column<T>[];
    data: T[];
    actions?: Action<T>[];
    emptyMessage?: string;
    onRowClick?: (row: T) => void;
    className?: string;
}

function DataTable<T extends { id: string | number }>({
    title,
    columns,
    data,
    actions = [],
    emptyMessage = "No data available",
    onRowClick,
    className = "",
}: DataTableProps<T>) {
    const renderCell = (row: T, column: Column<T>) => {
        const accessor = column.accessor;
        if (typeof accessor === "function") {
            return accessor(row);
        }
        return <>{row[accessor as keyof T]}</>;
    };

    return (
        <div
            className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
        >
            <div className='px-4 py-3 border-b border-gray-200'>
                <h3 className='text-lg font-medium text-gray-800'>{title}</h3>
            </div>
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-light-blue'>
                        <tr>
                            {columns.map((column, i) => (
                                <th
                                    key={i}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                                        column.className || ""
                                    }`}
                                    style={{
                                        minWidth: column.minWidth
                                            ? `${column.minWidth}px`
                                            : undefined,
                                        maxWidth: column.maxWidth
                                            ? `${column.maxWidth}px`
                                            : undefined,
                                    }}
                                >
                                    {column.header}
                                </th>
                            ))}
                            {actions.length > 0 && (
                                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {data?.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={row.id || rowIndex}
                                    onClick={() =>
                                        onRowClick && onRowClick(row)
                                    }
                                    className={
                                        onRowClick
                                            ? "cursor-pointer hover:bg-gray-50"
                                            : ""
                                    }
                                >
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`px-6 py-4 text-sm text-gray-500 ${
                                                column.className || ""
                                            }`}
                                            style={{
                                                minWidth: column.minWidth
                                                    ? `${column.minWidth}px`
                                                    : undefined,
                                                maxWidth: column.maxWidth
                                                    ? `${column.maxWidth}px`
                                                    : undefined,
                                                wordBreak: "break-word",
                                                whiteSpace: "normal",
                                            }}
                                        >
                                            {renderCell(row, column)}
                                        </td>
                                    ))}
                                    {actions.length > 0 && (
                                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm'>
                                            <div className='flex justify-end space-x-2'>
                                                {actions.map(
                                                    (action, actionIndex) => (
                                                        <button
                                                            key={actionIndex}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                action.onClick(
                                                                    row
                                                                );
                                                            }}
                                                            className={
                                                                action.buttonStyle ||
                                                                "px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                                            }
                                                        >
                                                            {action.label}
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={
                                        columns.length +
                                        (actions.length > 0 ? 1 : 0)
                                    }
                                    className='px-6 py-4 text-center text-sm text-gray-500'
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DataTable;
