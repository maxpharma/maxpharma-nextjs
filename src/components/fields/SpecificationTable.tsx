import React, { useState, useEffect } from "react";
import { useFormikContext, getIn } from "formik";
import { Plus, X } from "lucide-react";

interface SpecificationTableProps {
    name: string;
    label: string;
    keyPlaceholder: string;
    valuePlaceholder: string;
}

interface SpecPair {
    id: string; // Unique identifier for UI purposes
    key: string;
    value: string;
}

const SpecificationTable: React.FC<SpecificationTableProps> = ({
    name,
    label,
    keyPlaceholder,
    valuePlaceholder,
}) => {
    const { values, setFieldValue, touched, errors } = useFormikContext<any>();
    const [specPairs, setSpecPairs] = useState<SpecPair[]>([]);

    // Get field error and touched state
    const fieldError = getIn(errors, name);
    const fieldTouched = getIn(touched, name);
    const hasError = fieldTouched && fieldError;

    // Initialize with data or empty rows
    useEffect(() => {
        const fieldValue = values[name] || {};

        // Convert fieldValue to SpecPair[]
        const pairs: SpecPair[] = Object.entries(fieldValue).map(
            ([key, value], index) => ({
                id: `spec-${index}`,
                key,
                value: value as string,
            })
        );

        // Always ensure at least 4 rows on mount or when value changes
        if (pairs.length === 0 && specPairs.length === 0) {
            // Initial mount: show 4 empty rows
            setSpecPairs([
                { id: `spec-new-0`, key: "", value: "" },
                { id: `spec-new-1`, key: "", value: "" },
                { id: `spec-new-2`, key: "", value: "" },
                { id: `spec-new-3`, key: "", value: "" },
            ]);
        } else if (
            pairs.length > 0 &&
            (pairs.length !== specPairs.length ||
                pairs.some(
                    (p, i) =>
                        p.key !== specPairs[i]?.key ||
                        p.value !== specPairs[i]?.value
                ))
        ) {
            // If value changed, sync pairs and pad to 4 if needed
            while (pairs.length < 4) {
                pairs.push({
                    id: `spec-new-${Date.now()}-${pairs.length}`,
                    key: "",
                    value: "",
                });
            }
            setSpecPairs(pairs);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values[name]]); // Re-run when Formik field value changes

    // Update the Formik field value
    const updateFormikValue = (newPairs: SpecPair[]) => {
        const newValue: Record<string, string> = {};
        newPairs.forEach((pair) => {
            if (pair.key && pair.key.trim() !== "") {
                newValue[pair.key] = pair.value;
            }
        });
        setFieldValue(name, newValue);
    };

    const handleKeyChange = (id: string, newKey: string) => {
        const updatedPairs = specPairs.map((pair) => {
            if (pair.id === id) {
                return { ...pair, key: newKey };
            }
            return pair;
        });

        setSpecPairs(updatedPairs);
        updateFormikValue(updatedPairs);
    };

    const handleValueChange = (id: string, newValue: string) => {
        const updatedPairs = specPairs.map((pair) => {
            if (pair.id === id) {
                return { ...pair, value: newValue };
            }
            return pair;
        });

        setSpecPairs(updatedPairs);
        updateFormikValue(updatedPairs);
    };

    const handleRemove = (id: string) => {
        const updatedPairs = specPairs.filter((pair) => pair.id !== id);

        // Only pad to 4 if all rows are empty after remove
        const hasNonEmpty = updatedPairs.some(
            (pair) => pair.key.trim() !== "" || pair.value.trim() !== ""
        );
        if (!hasNonEmpty) {
            while (updatedPairs.length < 4) {
                updatedPairs.push({
                    id: `spec-new-${Date.now()}-${updatedPairs.length}`,
                    key: "",
                    value: "",
                });
            }
        }

        setSpecPairs(updatedPairs);
        updateFormikValue(updatedPairs);
    };

    const handleAddSpec = () => {
        // Always add a new row when button is clicked
        const newPairs = [
            ...specPairs,
            {
                id: `spec-new-${Date.now()}-${specPairs.length}`,
                key: "",
                value: "",
            },
        ];
        setSpecPairs(newPairs);
        // No need to update Formik since empty rows don't affect the final value
    };

    // Check if we need to add an empty row at the end
    useEffect(() => {
        // Check if every row has data and add a new empty row if needed
        const allRowsFilled = specPairs.every((pair) => pair.key !== "");

        if (allRowsFilled && specPairs.length > 0) {
            const newPairs = [
                ...specPairs,
                {
                    id: `spec-new-${Date.now()}-${specPairs.length}`,
                    key: "",
                    value: "",
                },
            ];
            setSpecPairs(newPairs);
        }
    }, [specPairs]);

    return (
        <div className='mb-4'>
            {!!label && (
                <label
                    className={`block text-sm font-medium mb-1 ${
                        hasError ? "text-red-500" : "text-gray-700"
                    }`}
                >
                    {label}
                </label>
            )}

            <div
                className={`border rounded-md overflow-hidden bg-white ${
                    hasError ? "border-red-500" : "border-gray-300"
                }`}
            >
                {specPairs.map((pair, index) => (
                    <div
                        key={pair.id}
                        className={`flex ${
                            index !== 0 ? "border-t border-gray-200" : ""
                        }`}
                    >
                        <div className='flex-1 flex items-center'>
                            {/* Use textarea for key (question) with auto-resize */}
                            <textarea
                                id={`key-${pair.id}`}
                                className='w-full h-auto min-h-[32px] max-h-40 py-2 px-4 focus:outline-none resize-none'
                                placeholder={keyPlaceholder}
                                value={pair.key}
                                onChange={(e) => {
                                    handleKeyChange(pair.id, e.target.value);
                                    e.target.style.height = "auto";
                                    e.target.style.height =
                                        e.target.scrollHeight + "px";
                                }}
                                rows={1}
                                style={{ overflow: "hidden" }}
                                ref={(el) => {
                                    if (el) {
                                        el.style.height = "auto";
                                        el.style.height =
                                            el.scrollHeight + "px";
                                    }
                                }}
                            />
                        </div>
                        <div className='w-px bg-gray-200'></div>
                        <div className='flex-1 flex items-center'>
                            {/* Use textarea for value (answer) with auto-resize */}
                            <textarea
                                className={`w-full h-auto min-h-[40px] max-h-40 py-2 px-4 focus:outline-none resize-none ${
                                    !pair.key
                                        ? "bg-[#f9fbff] text-gray-400"
                                        : ""
                                }`}
                                placeholder={valuePlaceholder}
                                value={pair.value}
                                onChange={(e) => {
                                    handleValueChange(pair.id, e.target.value);
                                    e.target.style.height = "auto";
                                    e.target.style.height =
                                        e.target.scrollHeight + "px";
                                }}
                                disabled={!pair.key}
                                rows={1}
                                style={{ overflow: "hidden" }}
                                ref={(el) => {
                                    if (el) {
                                        el.style.height = "auto";
                                        el.style.height =
                                            el.scrollHeight + "px";
                                    }
                                }}
                            />
                        </div>
                        <button
                            type='button'
                            className={`px-3 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-gray-50 transition-colors ${
                                !pair.key && specPairs.length > 2
                                    ? "invisible"
                                    : ""
                            }`}
                            onClick={() => handleRemove(pair.id)}
                            aria-label='Remove specification'
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {!!hasError && (
                <p className='mt-1 text-sm text-red-500'>
                    {typeof fieldError === "string"
                        ? fieldError
                        : "Please check the specification fields"}
                </p>
            )}

            <div className='pt-3'>
                <button
                    type='button'
                    className='flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors'
                    onClick={handleAddSpec}
                >
                    <Plus size={16} />
                    <span>Add Row</span>
                </button>
            </div>
        </div>
    );
};

export default SpecificationTable;
