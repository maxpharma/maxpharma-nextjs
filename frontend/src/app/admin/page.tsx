"use client";

import Admin from "@/api/admin";
import ActionButton from "@/components/ActionButton";
import CustomImage from "@/components/CustomImage";
import Input from "@/components/fields/Input";
import websiteData from "@/features/data";
import { Helper } from "@/utils";

import { Form, Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useState } from "react";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const initialValues = {
    username: "",
    password: "",
  };

  const submithandler = async (values: any) => {
    setLoading(true);

    const payload = {
      username: values.username,
      password: values.password,
    };

    try {
      const res = await Admin.login(payload);

      Helper.saveUser(res);
      if (res?.token) {
        window.location.href = "/admin/dashboard";
      }
    } catch (err) {
      console.error("Login Error:", err);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="">
        <div className="w-full bg-white  flex items-center justify-between py-1 px-8 shadow-md">
          <CustomImage src={websiteData.logo} className="h-16 w-48" />
          <nav className=" flex justify-end gap-4">
            <button className="button" onClick={() => router.push("/")}>
              Visit Website
            </button>
            <button
              className="secondary-button"
              onClick={() => router.push(websiteData.inflancerCrm)}
            >
              Inflancer CRM
            </button>
          </nav>
        </div>
        <div className="mx-auto p-12 rounded-2xl max-w-100 bg-white shadow-md mt-32 ">
          <Formik initialValues={initialValues} onSubmit={submithandler}>
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit} className="form">
                <Input
                  label="Username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                />
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                />
                <ActionButton loading={loading} classname="w-full">
                  Login
                </ActionButton>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
