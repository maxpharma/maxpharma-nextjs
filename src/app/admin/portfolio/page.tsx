"use client";

import GeneralSettings from "@/api/generalSettings";
import Portfolio from "@/api/portfolio";
import ActionButton from "@/components/ActionButton";
import Input from "@/components/fields/Input";
import Upload from "@/components/fields/Upload";
import { Form, Formik } from "formik";
import { init } from "next/dist/compiled/webpack/webpack";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PortfolioData from "./PortfolioData";

import { Dispatch, SetStateAction } from "react";
import update from "@/store/reducer/update";

export interface PortfolioType {
  id: number;
  title: string;
  type: string;
  file: string;
}

const PortfolioPage = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isOverlayRendered, setIsOverlayRendered] = useState(false);
  const [loading, setLoading] = useState(false);

  const [updateIdData, setUpdateIdData] = useState<PortfolioType | null>(null);

  console.log("updateIdData", updateIdData);

  const [type, setType] = useState(
    updateIdData?.type ? updateIdData?.type : null
  );

  console.log("type", type);

  const [initialValues, setInitialValues] = useState({
    title: "",
    type: "",
    file: "",
  });

  useEffect(() => {
    if (updateIdData?.id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setInitialValues({
        title: updateIdData?.title,
        type: updateIdData?.type,
        file: `${process.env.NEXT_PUBLIC_BUCKET_URL}/${updateIdData?.file}`,
      });
      setType(updateIdData?.type);
    } else {
      setInitialValues({
        title: "",
        type: "",
        file: "",
      });
      setType(null);
    }
  }, [updateIdData, updateIdData?.id, updateIdData?.type]);

  useEffect(() => {
    if (isOverlayOpen) {
      setIsOverlayRendered(true);
      setTimeout(() => setIsOverlayVisible(true), 10);
    } else {
      setIsOverlayVisible(false);
      const timer = setTimeout(() => setIsOverlayRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOverlayOpen]);

  const createPortfolioSubmitHandler = async (
    values: any,
    { resetForm }: any
  ) => {
    try {
      setLoading(true);

      const payload = {
        group: "portfolioType",
        key: Date.now().toLocaleString(),
        value: values.portfolioType,
      };

      await GeneralSettings.create("portfolioType", payload);

      resetForm();
      setIsOverlayOpen(false);
    } catch (error) {
      console.error("Error saving portfolio type:", error);
    } finally {
      setLoading(false);
      resetForm();
      setIsOverlayOpen(false);
    }
  };

  const { data: portfolioTypes } = useSelector(
    (state: any) => state.portfolioType
  );

  const fetchPortfolioTypes = async () => {
    await GeneralSettings.getByGroup("portfolioType", "portfolioType", "");
  };

  useEffect(() => {
    if (!portfolioTypes?.length) fetchPortfolioTypes();
  }, [portfolioTypes?.length]);

  const submitHandler = async (values: any) => {
    setLoading(true);

    if (!values.file || values.file.length === 0) {
      console.error("No files uploaded");
      setLoading(false);
      return;
    }

    const payload = {
      title: values.title,
      type: type,
      file: {
        extension: values.file.extension,
        base64: values.file.base64,
      },
    };

    try {
      if (updateIdData?.id) {
        await Portfolio.update("portfolio", payload, updateIdData?.id);
      } else {
        await Portfolio.create("portfolio", payload);
      }
    } catch (error) {
      console.error("Error creating portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <h1>Add Portfolio</h1>
        {/* Overlay trigger button with inline handler */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            {(Array.isArray(portfolioTypes) &&
              portfolioTypes.map((portfolioType) => (
                <div
                  key={portfolioType.key}
                  className={`cursor-pointer ${
                    type === portfolioType.value
                      ? "active-button"
                      : "inactive-button"
                  }`}
                  onClick={() => setType(portfolioType.value)}
                >
                  {portfolioType.value}
                </div>
              ))) || <p>No portfolio types available</p>}
          </div>
          <button
            className="text-blue-600 font-medium hover:underline"
            onClick={() => setIsOverlayOpen(true)}
          >
            Add Portfolio
          </button>
        </div>

        {/* Overlay */}
        {isOverlayRendered && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
              className={`bg-white rounded-lg p-6 w-full max-w-md shadow-xl transition-all duration-300 ease-in-out ${
                isOverlayVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
              }`}
            >
              <h2 className="text-xl font-medium text-blue-600 mb-6">
                Add Portfolio
              </h2>

              <div className="mb-4">
                <Formik
                  initialValues={{
                    portfolioType: "",
                  }}
                  onSubmit={createPortfolioSubmitHandler}
                >
                  {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                      <Input
                        label="New Portfolio Type"
                        name="portfolioType"
                        placeholder="Enter portfolio type"
                        type="text"
                      />
                      <div className="flex gap-4 mt-8">
                        <button
                          type="button"
                          className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
                          onClick={() => setIsOverlayOpen(false)}
                        >
                          Cancel
                        </button>
                        <ActionButton loading={loading} type="submit">
                          Save
                        </ActionButton>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={submitHandler}
          enableReinitialize={true}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Input
                name="title"
                label="Title"
                placeholder="Enter title"
                type="text"
              />

              <Upload
                name="file"
                label="Upload Image"
                variant="dashed"
                value={
                  updateIdData?.file
                    ? `${process.env.NEXT_PUBLIC_BUCKET_URL}/${updateIdData?.file}`
                    : null
                }
              />
              <ActionButton type="submit" loading={loading}>
                {updateIdData?.id ? "Update" : "Upload"}
              </ActionButton>
            </Form>
          )}
        </Formik>
      </div>
      <PortfolioData setUpdateIdData={setUpdateIdData} />
    </>
  );
};

export default PortfolioPage;
