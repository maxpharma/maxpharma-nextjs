"use client";

import Popup from "@/api/popup";
import ActionButton from "@/components/ActionButton";
import Upload from "@/components/fields/Upload";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import PopupData from "./PopupData";

const PopupPage = () => {
  const [loading, setLoading] = useState(false);

  const [initialValues, setInitialValues] = useState({
    image: "",
  });

  const submitHandler = async (values: any, { resetForm }: any) => {
    setLoading(true);

    if (typeof values.image === "string" || !values.image?.base64) {
      console.error("No file uploaded");
      setLoading(false);
      return;
    }

    const payload = {
      image: {
        extension: values.image.extension,
        base64: values.image.base64,
      },
    };

    try {
      await Popup.create("popup", payload);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  return (
    <>
      <div>
        <h1>Add PopUP</h1>
        <Formik
          initialValues={initialValues}
          onSubmit={submitHandler}
          enableReinitialize={true}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Upload name="image" label="Upload Image" />

              <ActionButton loading={loading} classname="flex justify-self-end">
                Save
              </ActionButton>
            </Form>
          )}
        </Formik>
        <PopupData />
      </div>
    </>
  );
};

export default PopupPage;
