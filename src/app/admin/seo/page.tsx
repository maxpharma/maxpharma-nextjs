"use client";

import GeneralSettings from "@/api/generalSettings";
import ActionButton from "@/components/ActionButton";
import CustomToast from "@/components/CustomToast";
import Input from "@/components/fields/Input";
import TextArea from "@/components/fields/TextArea";
import { Form, Formik, FormikProps } from "formik";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

// Define the form values interface
interface FormValues {
  title: string;
  description: string;
  keywords: string;
}

const SeoForm = () => {
  const [showToast, setShowToast] = useState(false);

  const [selectedPage, setSelectedPage] = useState({
    name: "Home",
    state: "homeSeo",
  });
  const [loading, setLoading] = useState(false);

  // Properly type the formikRef
  const formikRef = useRef<FormikProps<FormValues>>(null);

  const { data: storedData } = useSelector(
    (state: any) => state[selectedPage.state]
  );

  const fetchData = async () => {
    await GeneralSettings.getByKey(selectedPage.state, selectedPage.state);
  };

  // Parse data safely, return empty object if parsing fails
  const parseStoredData = (value: string): Record<string, any> => {
    try {
      return value ? JSON.parse(value) : {};
    } catch (e) {
      console.error("Error parsing data:", e);
      return {};
    }
  };

  // Extract form values from parsed data
  const getFormValues = (parsedData: Record<string, any>): FormValues => ({
    title: parsedData?.title || "",
    description: parsedData?.description || "",
    keywords: parsedData?.keywords || "",
  });

  // Initial values derived from props or default empty values
  const [initialValues, setInitialValues] = useState<FormValues>({
    title: "",
    description: "",
    keywords: "",
  });

  // Effect to fetch data when selected page changes or when data is not available
  useEffect(() => {
    fetchData();
    // Only add selectedPage.state as dependency to prevent infinite loops
  }, [selectedPage.state]);

  // Effect to update form values when stored data changes
  useEffect(() => {
    if (storedData?.value) {
      const parsedData = parseStoredData(storedData.value);
      const formValues = getFormValues(parsedData);
      setInitialValues(formValues);

      // If Formik instance exists, reset form with new values
      if (formikRef.current) {
        formikRef.current.resetForm({ values: formValues });
      }
    } else {
      setInitialValues({
        title: "",
        description: "",
        keywords: "",
      });
    }
  }, [storedData?.value]);

  const submitHandler = async (values: FormValues, { resetForm }: any) => {
    setLoading(true);

    const payload = {
      title: selectedPage.name,
      key: selectedPage.state,
      value: JSON.stringify(values),
    };

    try {
      if (storedData?.id) {
        await GeneralSettings.update(
          selectedPage.state,
          payload,
          storedData.id
        );
      } else {
        await GeneralSettings.create(selectedPage.state, payload);
      }

      setShowToast(true);

      await fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  const pages = [
    { name: "Home", state: "homeSeo" },
    { name: "Overview", state: "overviewSeo" },
    { name: "Strategic Objective", state: "strategicObjectiveSeo" },
    { name: "Corporate Governance", state: "corporateGovernanceSeo" },
    { name: "Board of Directors", state: "boardOfDirectorsSeo" },
    { name: "Management Team", state: "managementTeamSeo" },
    { name: "Notice Board", state: "noticeBoardSeo" },
    { name: "Projects", state: "projectsSeo" },
    { name: "Gallery", state: "gallerySeo" },
    { name: "Portfolio", state: "portfolioSeo" },
    { name: "Contact", state: "contactSeo" },
    { name: "Request Share", state: "requestShareSeo" },
  ];

  return (
    <>
      <div className="bg-light-blue p-4 rounded-lg mb-8">
        <h1>Seo Settings</h1>
        <div className="flex gap-2 flex-wrap justify-center p-12">
          {pages.map((page, index) => (
            <div
              key={index}
              className={`rounded-lg px-2 py-1 text-sm font-normal transition duration-200 cursor-pointer ${
                selectedPage.state === page.state
                  ? "bg-primary text-white"
                  : "bg-white text-primary hover:bg-blue-100"
              } `}
              onClick={() => setSelectedPage(page)}
            >
              <span>{page.name}</span>
            </div>
          ))}
        </div>
      </div>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        onSubmit={submitHandler}
        enableReinitialize={true}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Input name="title" label="Title" placeholder="Title" />
            <TextArea
              name="description"
              label="Description"
              placeholder="Description"
            />
            <TextArea name="keywords" label="Keywords" placeholder="Keywords" />
            <ActionButton type="submit" loading={loading}>
              {storedData?.id ? "Update" : "Save"}
            </ActionButton>
          </Form>
        )}
      </Formik>
      {showToast && (
        <CustomToast
          title="Success"
          message="Seo settings updated successfully"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default SeoForm;
