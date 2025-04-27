import GeneralSettings from "@/api/generalSettings";
import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import Overlay from "@/components/Overlay";
import { Form, Formik } from "formik";
import React, { useState } from "react";

const AddCategory = ({
  isOpen,
  onClose,
  onCategoryAdded,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const initialValues = {
    category: "",
  };

  const submitHandler = async (values: any, { resetForm }: any) => {
    setLoading(true);

    const payload = {
      group: "categories",
      key: values.category,
      value: values.category,
    };

    try {
      await GeneralSettings.create("categories", payload);
      resetForm();
      onCategoryAdded();
    } catch (error: any) {
      if (
        error instanceof Error &&
        error.message.includes(
          "Cannot read properties of undefined (reading 'data')"
        )
      ) {
        resetForm();
        onCategoryAdded();
      } else {
        console.error("Error adding category:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <Overlay isOpen={isOpen} onClose={onClose}>
          <div className="space-y-4 min-w-[320px]">
            <h2 className="text-lg font-semibold">Add Category</h2>
            <Formik initialValues={initialValues} onSubmit={submitHandler}>
              <Form>
                <Input
                  name="category"
                  label="Category Name"
                  placeholder="Enter category name"
                />
                <div className="flex gap-3 mt-4 justify-end">
                  <Button variant="submit" loading={loading}>
                    Add
                  </Button>
                </div>
              </Form>
            </Formik>
          </div>
        </Overlay>
      )}
    </>
  );
};

export default AddCategory;
