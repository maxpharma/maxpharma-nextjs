import React, { useState } from "react";
import { Form, Formik, FieldArray } from "formik";
import Input from "@/components/fields/Input";
import TextArea from "@/components/fields/TextArea";
import Upload from "@/components/fields/Upload";
import Button from "@/components/Button";

const Manufactured = ({ category }: { category: string }) => {
    const [initialValues, setInitialValues] = useState({
        productName: "",
        productOverview: "",
        images: [],
        specifications: Array(4).fill({ key: "", value: "" }),
    });

    const submitHandler = async (values: any, { resetForm }: any) => {
        console.log(values);
        // Handle form submission
    };

    return (
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={submitHandler}
                enableReinitialize
            >
                {({ values }) => (
                    <Form>
                        {/* Product Name */}
                        <div className='mb-4'>
                            <Input
                                name='productName'
                                label='Product Name'
                                placeholder='Enter product name'
                                type='text'
                            />
                        </div>

                        {/* Product Overview */}
                        <div className='mb-4'>
                            <TextArea
                                name='productOverview'
                                label='Product Overview'
                                placeholder='Write product details...'
                            />
                        </div>

                        {/* Image Upload */}
                        <div className='mb-4'>
                            <div className='flex justify-between items-center mb-2'>
                                <label className='font-medium'>Image</label>
                                <button
                                    type='button'
                                    className='text-green-500 flex items-center gap-1'
                                >
                                    <span>Add Images</span>
                                    <span className='text-xl'>+</span>
                                </button>
                            </div>
                            <Upload
                                name='images'
                                label=''
                                placeholder='Add Multiple Images'
                                variant='multiple'
                            />
                        </div>

                        {/* Specifications */}
                        <div className='mb-4'>
                            <div className='flex justify-between items-center mb-2'>
                                <label className='font-medium'>
                                    Specification
                                </label>
                                <button
                                    type='button'
                                    className='py-1 px-3 text-sm rounded-full border border-primary text-primary flex items-center gap-1'
                                >
                                    <span>Add Specification</span>
                                    <span className='text-xl'>+</span>
                                </button>
                            </div>

                            <FieldArray name='specifications'>
                                {() => (
                                    <div className='grid grid-cols-2 gap-4'>
                                        {values.specifications.map(
                                            (_, index) => (
                                                <React.Fragment key={index}>
                                                    <Input
                                                        name={`specifications.${index}.key`}
                                                        label=''
                                                        placeholder='Enter Value'
                                                        type='text'
                                                    />
                                                    {index % 2 === 0 &&
                                                        index + 1 <
                                                            values
                                                                .specifications
                                                                .length && (
                                                            <Input
                                                                name={`specifications.${
                                                                    index + 1
                                                                }.key`}
                                                                label=''
                                                                placeholder='Enter Value'
                                                                type='text'
                                                            />
                                                        )}
                                                </React.Fragment>
                                            )
                                        )}
                                    </div>
                                )}
                            </FieldArray>
                        </div>

                        {/* Save Button */}
                        <div className='text-right'>
                            <Button variant='submit'>Save</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Manufactured;
