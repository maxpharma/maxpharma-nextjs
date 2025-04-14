"use client";

import Team from "@/api/team";
import ActionButton from "@/components/ActionButton";
import Input from "@/components/fields/Input";
import Upload from "@/components/fields/Upload";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import TeamData from "./TeamData";

interface FileData {
  id: number;
  name: string;
  role: string;
  companyName: string;
  image: string;
}

const TeamPage = () => {
  const [updatedIdData, setUpdatedIdData] = useState<FileData | null>(null);
  console.log(updatedIdData, "updatedIdData");
  const [toggle, setToggle] = useState("directors");

  const [loading, setLoading] = useState(false);

  const [initialValues, setInitialValues] = useState({
    file: "",
    name: "",
    role: "",
    companyName: "",
  });

  useEffect(() => {
    if (updatedIdData?.id) {
      setInitialValues({
        file: `${process.env.NEXT_PUBLIC_BUCKET_URL}/${updatedIdData?.image}`,
        name: updatedIdData?.name,
        role: updatedIdData?.role,
        companyName: updatedIdData?.companyName,
      });
    } else {
      setInitialValues({
        file: "",
        name: "",
        role: "",
        companyName: "",
      });
    }
  }, [updatedIdData, updatedIdData?.id, updatedIdData?.image]);

  const submitHandler = async (
    values: any,
    { resetForm }: { resetForm: () => void }
  ) => {
    setLoading(true);

    const payload = {
      type: toggle,
      additionalInfo: {
        name: values.name,
        role: values.role,
        companyName: values.companyName,
      },
      image: {
        base64: values.file.base64,
        extension: values.file.extension,
      },
    };

    try {
      if (updatedIdData?.id) {
        await Team.update(toggle, payload, updatedIdData?.id);
      } else {
        await Team.create(toggle, payload);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      resetForm();
      setLoading(false);
      setUpdatedIdData(null);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setToggle("directors")}
          className={
            toggle === "directors" ? "active-button" : "inactive-button"
          }
        >
          Board of Directors
        </button>
        <button
          onClick={() => setToggle("team")}
          className={toggle === "team" ? "active-button" : "inactive-button"}
        >
          Management Team
        </button>
      </div>
      <div className="my-4">
        <Formik
          initialValues={initialValues}
          onSubmit={submitHandler}
          enableReinitialize={true}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="flex gap-8">
                <Upload
                  name="file"
                  label="Upload Image"
                  variant="dashed"
                  className="w-1/3 "
                  value={
                    updatedIdData?.image
                      ? `${process.env.NEXT_PUBLIC_BUCKET_URL}/${updatedIdData?.image}`
                      : null
                  }
                />
                <div className="flex-1">
                  <Input name="name" label="Name" placeholder="Name" />
                  <Input name="role" label="Role" placeholder="Role" />
                  <Input
                    name="companyName"
                    label="CompanyName"
                    placeholder="CompanyName"
                  />
                </div>
              </div>
              <ActionButton
                type="submit"
                loading={loading}
                classname="flex justify-self-end"
              >
                Upload
              </ActionButton>
            </Form>
          )}
        </Formik>
      </div>
      <TeamData setUpdatedIdData={setUpdatedIdData} />
    </>
  );
};

export default TeamPage;
