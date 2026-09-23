import GeneralSettings from "@/api/generalSettings";
import DataTable from "@/components/DataTable";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const FaqsTable = ({
    type,
    onEdit,
}: {
    type: string;
    onEdit: (item: any) => void;
}) => {
    const { data: faqsDataRaw } = useSelector((state: any) => state.faqs);

    const faqsData = Array.isArray(faqsDataRaw)
        ? [...faqsDataRaw].reverse()
        : [];

    // Edit state
    const [editId, setEditId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<{
        question: string;
        answer: string;
    }>({ question: "", answer: "" });
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        await GeneralSettings.getByGroup("faqs", "faqs");
    };

    useEffect(() => {
        if (!faqsData?.length) {
            fetchData();
        }
    }, [faqsData?.length, type]);

    // Ensure faqsData is always an array
    const faqsArray = Array.isArray(faqsData) ? faqsData : [];

    // Filter by value (type) instead of infos.type
    const filteredData =
        faqsArray.filter((item: any) => item?.value === type) || [];

    // Edit handlers
    const handleEdit = (item: any) => {
        setEditId(item.id);
        setEditValues({
            question: item.infos?.question || "",
            answer: item.infos?.answer || "",
        });
    };

    const handleEditChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setEditValues((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleEditSubmit = async (id: number) => {
        setLoading(true);
        try {
            await GeneralSettings.update(
                "faqs",
                {
                    group: "faqs",
                    value: type,
                    infos: {
                        question: editValues.question,
                        answer: editValues.answer,
                    },
                },
                id
            );
            setEditId(null);
            setEditValues({ question: "", answer: "" });
            await fetchData();
        } catch (err) {
            // Optionally show error
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        setLoading(true);
        try {
            await GeneralSettings.remove("faqs", id);
            await fetchData();
        } catch (err) {
            // Optionally show error
        }
        setLoading(false);
    };

    const column = [
        {
            id: "question",
            header: "Question",
            accessor: "question",
            minWidth: 170,
        },
        {
            id: "answer",
            header: "Answer",
            accessor: "answer",
            minWidth: 200,
        },
        { id: "action", header: "Action", accessor: "action", minWidth: 170 },
    ];

    const rows = filteredData?.map((item: any) => {
        return {
            id: item?.id,
            question: item?.infos?.question,
            answer: item?.infos?.answer,
            action: (
                <div className='flex space-x-2'>
                    <button
                        className='text-blue-500'
                        onClick={() => onEdit(item)}
                        disabled={loading}
                    >
                        Edit
                    </button>
                    <button
                        className='text-red-500'
                        onClick={() => handleDelete(item.id)}
                        disabled={loading}
                    >
                        Delete
                    </button>
                </div>
            ),
        };
    });

    return (
        <div>
            <DataTable title='FAQs' columns={column} data={rows} />
        </div>
    );
};

export default FaqsTable;
