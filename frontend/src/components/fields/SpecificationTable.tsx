import React, { useState, useEffect, useRef } from "react";
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
    const keyRefs = useRef<{ [id: string]: HTMLTextAreaElement | null }>({});
    const valueRefs = useRef<{ [id: string]: HTMLTextAreaElement | null }>({});

    // Track if we're currently typing to prevent focus loss
    const isTyping = useRef(false);

    // Get field error and touched state
    const fieldError = getIn(errors, name);
    const fieldTouched = getIn(touched, name);
    const hasError = fieldTouched && fieldError;

    // Initialize with data or empty rows - only on mount or when formik value changes from outside
    useEffect(() => {
        // Skip this effect if the user is currently typing
        if (isTyping.current) return;

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

    // Debounced update to Formik value
    const debouncedUpdateRef = useRef<NodeJS.Timeout | null>(null);
    const updateFormikValue = (newPairs: SpecPair[]) => {
        // Clear any pending debounce
        if (debouncedUpdateRef.current) {
            clearTimeout(debouncedUpdateRef.current);
        }

        // Set up a new debounced update
        debouncedUpdateRef.current = setTimeout(() => {
            const newValue: Record<string, string> = {};
            newPairs.forEach((pair) => {
                if (pair.key && pair.key.trim() !== "") {
                    newValue[pair.key] = pair.value;
                }
            });
            setFieldValue(name, newValue);
            debouncedUpdateRef.current = null;
        }, 300); // Delay Formik updates by 300ms
    };

    const handleKeyChange = (id: string, newKey: string) => {
        isTyping.current = true;
        const updatedPairs = specPairs.map((pair) => {
            if (pair.id === id) {
                return { ...pair, key: newKey };
            }
            return pair;
        });

        setSpecPairs(updatedPairs);
        updateFormikValue(updatedPairs);

        // Resize the textarea after state update
        setTimeout(() => {
            const ref = keyRefs.current[id];
            if (ref) {
                ref.style.height = "auto";
                ref.style.height = ref.scrollHeight + "px";
            }
            isTyping.current = false;
        }, 0);
    };

    const handleValueChange = (id: string, newValue: string) => {
        isTyping.current = true;
        const updatedPairs = specPairs.map((pair) => {
            if (pair.id === id) {
                return { ...pair, value: newValue };
            }
            return pair;
        });

        setSpecPairs(updatedPairs);
        updateFormikValue(updatedPairs);

        // Resize the textarea after state update
        setTimeout(() => {
            const ref = valueRefs.current[id];
            if (ref) {
                ref.style.height = "auto";
                ref.style.height = ref.scrollHeight + "px";
            }
            isTyping.current = false;
        }, 0);
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
    };

    // Check for empty rows less frequently - not on every render
    useEffect(() => {
        // Skip during typing to prevent focus loss
        if (specPairs.length === 0) {
            setSpecPairs((prev) =>
                prev.length === 0
                    ? [
                          {
                              id: `spec-new-${Date.now()}-0`,
                              key: "",
                              value: "",
                          },
                      ]
                    : prev
            );
        }
    }, [specPairs.length]); // Only check when row count changes

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
                            <textarea
                                id={`key-${pair.id}`}
                                className='w-full h-auto min-h-[32px] max-h-40 py-2 px-4 focus:outline-none resize-none'
                                placeholder={keyPlaceholder}
                                value={pair.key}
                                onChange={(e) => {
                                    handleKeyChange(pair.id, e.target.value);
                                }}
                                rows={1}
                                style={{ overflow: "hidden" }}
                                ref={(el) => {
                                    keyRefs.current[pair.id] = el;
                                }}
                            />
                        </div>
                        <div className='w-px bg-gray-200'></div>
                        <div className='flex-1 flex items-center'>
                            <textarea
                                className={`w-full h-auto min-h-[40px] max-h-40 py-2 px-4 focus:outline-none resize-none bg-white ${
                                    !pair.key ? "text-gray-400" : ""
                                }`}
                                placeholder={valuePlaceholder}
                                value={pair.value}
                                onChange={(e) => {
                                    handleValueChange(pair.id, e.target.value);
                                }}
                                disabled={!pair.key}
                                rows={1}
                                style={{ overflow: "hidden" }}
                                ref={(el) => {
                                    valueRefs.current[pair.id] = el;
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
