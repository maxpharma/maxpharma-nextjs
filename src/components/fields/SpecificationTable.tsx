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

        // Only initialize if specPairs is empty (first render)
        if (specPairs.length === 0) {
            const pairs: SpecPair[] = Object.entries(fieldValue).map(
                ([key, value], index) => ({
                    id: `spec-${index}`,
                    key,
                    value: value as string,
                })
            );

            // Ensure we have at least 2 rows initially
            if (pairs.length === 0) {
                pairs.push(
                    { id: `spec-new-1`, key: "", value: "" },
                    { id: `spec-new-2`, key: "", value: "" }
                );
            } else if (pairs.length === 1) {
                pairs.push({ id: `spec-new-1`, key: "", value: "" });
            }

            setSpecPairs(pairs);
        }
    }, []); // Only run once on component mount

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

        // Ensure we always have at least 2 rows
        if (updatedPairs.length === 1) {
            updatedPairs.push({
                id: `spec-new-${Date.now()}`,
                key: "",
                value: "",
            });
        } else if (updatedPairs.length === 0) {
            updatedPairs.push(
                { id: `spec-new-${Date.now()}`, key: "", value: "" },
                { id: `spec-new-${Date.now() + 1}`, key: "", value: "" }
            );
        }

        setSpecPairs(updatedPairs);
        updateFormikValue(updatedPairs);
    };

    const handleAddSpec = () => {
        // Always add a new row when button is clicked
        const newPairs = [
            ...specPairs,
            { id: `spec-new-${Date.now()}`, key: "", value: "" },
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
                { id: `spec-new-${Date.now()}`, key: "", value: "" },
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
                            <input
                                id={`key-${pair.id}`}
                                type='text'
                                className='w-full h-full py-2 px-4 focus:outline-none'
                                placeholder={keyPlaceholder}
                                value={pair.key}
                                onChange={(e) =>
                                    handleKeyChange(pair.id, e.target.value)
                                }
                            />
                        </div>
                        <div className='w-px bg-gray-200'></div>
                        <div className='flex-1 flex items-center'>
                            <input
                                type='text'
                                className={`w-full h-full py-2 px-4 focus:outline-none ${
                                    !pair.key
                                        ? "bg-[#f9fbff] text-gray-400"
                                        : ""
                                }`}
                                placeholder={valuePlaceholder}
                                value={pair.value}
                                onChange={(e) =>
                                    handleValueChange(pair.id, e.target.value)
                                }
                                disabled={!pair.key}
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
                    <span>Add Specification</span>
                </button>
            </div>
        </div>
    );
};

export default SpecificationTable;
