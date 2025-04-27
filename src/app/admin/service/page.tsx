"use client";

import GeneralSettings from "@/api/generalSettings";
import Services from "@/api/services";
import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import MyEditor from "@/components/fields/MyEditor";
import Upload from "@/components/fields/Upload";
import { FieldArray, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddServiceCategory from "./AddServiceCategory";

const ServicePage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(1);

  const { data: serviceCategories } = useSelector(
    (state: any) => state.serviceCategories
  );

  const fetchServiceCategories = async () => {
    await GeneralSettings.getByGroup("serviceCategories", "serviceCategories");
  };

  useEffect(() => {
    if (!serviceCategories?.length) {
      fetchServiceCategories();
    }
  }, [serviceCategories?.length]);

  useEffect(() => {
    if (serviceCategories?.length) {
      setSelectedCategoryId(serviceCategories[0]?.id || 1);
    }
  }, [serviceCategories?.length, serviceCategories]);

  const selectedCategoryData = Array.isArray(serviceCategories)
    ? serviceCategories.find((item: any) => item.id === selectedCategoryId)
    : null;

  const [currentService, setCurrentService] = useState({
    title: "",
    description: "",
    files: [],
  });

  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    files: [],
  });

  const fetchServiceDataById = async () => {
    const response = await Services.getbyId(
      selectedCategoryData?.infos?.serviceId
    );
    setCurrentService(response);
  };

  useEffect(() => {
    if (!currentService) {
      fetchServiceDataById();
    }
  }, [currentService]);

  useEffect(() => {
    if (!!selectedCategoryData?.infos?.serviceId) {
      fetchServiceDataById();
    }
  }, [selectedCategoryData?.infos?.serviceId, selectedCategoryId]);

  useEffect(() => {
    if (!!selectedCategoryData?.infos?.serviceId) {
      setInitialValues({
        title: currentService?.title || "",
        description: currentService?.description || "",
        files: currentService?.files || [],
      });
    } else {
      setInitialValues({
        title: "",
        description: "",
        files: [],
      });
    }
  }, [currentService, selectedCategoryId]);

  const submitHandler = async (values: any, { resetForm }: any) => {
    setLoading(true);

    // Always construct files array with both images (updated or previous)
    const filesToSend = [0, 1].map((index) => {
      const newFile = values.files[index];
      const oldFile = initialValues.files[index]; // always a string (path) or undefined

      // If newFile has base64, use it (new upload)
      if (newFile?.base64) {
        return {
          extension: newFile.extension,
          base64: newFile.base64,
        };
      }
      // Otherwise, use the old file path string (if exists)
      if (typeof oldFile === "string") {
        return oldFile;
      }
      return null;
    });

    // Check if any file has changed (newFile has base64)
    const filesChanged = [0, 1].some((index) => values.files[index]?.base64);

    const payload: any = {
      categoryId: selectedCategoryId,
      title: values.title || initialValues.title,
      description: values.description || initialValues.description,
    };

    // Only include files if at least one has changed, else keep as is
    if (filesChanged) {
      payload.files = filesToSend;
    }

    try {
      if (selectedCategoryData?.infos?.serviceId) {
        await Services.update(payload, selectedCategoryData?.infos?.serviceId);
        fetchServiceDataById();
      } else {
        const response = await Services.create({
          ...payload,
          files: filesToSend,
        });
        const serviceId = response?.id;
        const categoryPayload = {
          group: "serviceCategories",
          key: Date.now().toString(),
          value: selectedCategoryData?.value,
          infos: {
            ...selectedCategoryData?.infos,
            serviceId: serviceId,
          },
        };
        fetchServiceDataById();
        await GeneralSettings.update(
          "serviceCategories",
          categoryPayload,
          selectedCategoryId
        );
      }

      resetForm();
    } catch (error) {
      console.error("Error adding service:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <AddServiceCategory />
      <div>
        {serviceCategories?.length > 0 && (
          <div className="flex gap-2 flex-1 h-fit">
            {serviceCategories.map((category: any) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-md ${
                  selectedCategoryId === category.id
                    ? "active-button"
                    : "inactive-button"
                }`}
                onClick={() => setSelectedCategoryId(category.id)}
              >
                {category?.value}
              </button>
            ))}
          </div>
        )}
      </div>
      <Formik
        initialValues={initialValues}
        onSubmit={submitHandler}
        enableReinitialize
      >
        <Form className="space-y-4">
          <Input name="title" placeholder="Title" label="Title" type="text" />

          <MyEditor
            name="description"
            label="Description"
            placeholder="Description"
          />

          <div>
            <label className="block mb-2 font-medium">Banner Images</label>
            <div className="flex gap-4 w-full">
              <FieldArray name="files">
                {() => (
                  <>
                    {[0, 1].map((index) => (
                      <Upload
                        key={index}
                        name={`files[${index}]`}
                        label="Upload Images"
                        placeholder="Upload Images"
                        className="flex-1"
                        variant="dashed"
                        size={200}
                        value={initialValues.files[index]}
                      />
                    ))}
                  </>
                )}
              </FieldArray>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="submit" loading={loading}>
              {selectedCategoryData?.infos?.serviceId ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default ServicePage;
