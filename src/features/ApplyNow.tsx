import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import PhoneInput from "@/components/fields/Phone";
import TextArea from "@/components/fields/TextArea";
import Upload from "@/components/fields/Upload";
import { Form, Formik } from "formik";
import React from "react";

const ApplyNow = () => {
  return (
    <div className="space-y-4 ">
      <h1>Interested in Our Products</h1>
      <Formik
        initialValues={{
          name: "",
          phone: "",
          email: "",
          file: "",
          subjest: "",
          message: "",
        }}
        onSubmit={() => {}}
      >
        <Form>
          <div className="flex gap-4 flex-col sm:flex-row">
            <Input
              name="name"
              label="Name"
              placeholder="Enter your name"
              required
              className="flex-1"
            />
            <PhoneInput
              name="phone"
              label="Contact Number"
              placeholder="Phone Number"
              required
              className="flex-1"
            />
          </div>
          <div className="flex gap-4 flex-col sm:flex-row">
            <Input
              name="email"
              label="Email"
              placeholder="Enter your email"
              type="email"
              required
              className="flex-1"
            />
            <Input
              name="subjest"
              label="Subject"
              placeholder="Enter your subject"
              required
              className="flex-1"
            />
          </div>
          <Upload
            variant="dashed"
            name="file"
            label="Upload File"
            placeholder="Upload your Resume or CV "
          />
          <TextArea
            name="message"
            label="Message"
            placeholder="Enter your message"
            required
          />
          <Button variant="submit">Send Message</Button>
        </Form>
      </Formik>
    </div>
  );
};

export default ApplyNow;
