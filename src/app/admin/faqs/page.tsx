"use client";

import React, { useState, useEffect } from "react";
import GeneralSettings from "@/api/generalSettings";
import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import TextArea from "@/components/fields/TextArea";
import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import FaqsTable from "./FaqsTable";
import { q } from "framer-motion/client";

const FAQsPage = () => {
    const [loading, setLoading] = useState(false);
    const faqTypes = ["Home", "Contact", "Product"];

    const [selectedType, setSelectedType] = useState("Home");
    const [editId, setEditId] = useState<number | null>(null);
    const [initialState, setInitialState] = useState({
        question: "",
        answer: "",
    });

    // Handle edit from table
    const handleEdit = (item: any) => {
        setEditId(item.id);
        setInitialState({
            question: item?.infos?.question || "",
            answer: item?.infos?.answer || "",
        });
    };

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);
        const payload = {
            group: "faqs",
            key: Date.now().toString(),
            value: selectedType,
            infos: {
                question: values.question,
                answer: values.answer,
            },
        };
        try {
            if (editId) {
                // Update
                await GeneralSettings.update(
                    "faqs",
                    {
                        ...payload,
                        // don't update key
                    },
                    editId
                );
                setEditId(null);
            } else {
                // Create
                await GeneralSettings.create("faqs", payload);
            }
            resetForm();
            setInitialState({ question: "", answer: "" });
        } catch (error) {
            console.error("Error adding FAQ:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='space-y-4'>
            <div className='space-x-4'>
                {faqTypes.map((type) => (
                    <button
                        className={` ${
                            selectedType === type
                                ? "active-button"
                                : "inactive-button"
                        }`}
                        key={type}
                        onClick={() => setSelectedType(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>
            <Formik
                initialValues={initialState}
                onSubmit={submitHandler}
                enableReinitialize={true}
            >
                <Form>
                    <Input
                        name='question'
                        placeholder='Enter your question'
                        label='Question'
                        required
                    />
                    <TextArea
                        name='answer'
                        placeholder='Enter your answer'
                        label='Answer'
                        required
                    />
                    <Button variant='submit' loading={loading}>
                        {editId ? "Update" : "Submit"}
                    </Button>
                </Form>
            </Formik>
            <FaqsTable type={selectedType} onEdit={handleEdit} />
        </div>
    );
};

export default FAQsPage;
