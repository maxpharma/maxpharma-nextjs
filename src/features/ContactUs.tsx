"use client";

import React, { useState } from "react";
import { Form, Formik } from "formik";
import Image from "next/image";

import ActionButton from "@/components/ActionButton";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import Input from "@/components/fields/Input";
import PhoneInput from "@/components/fields/Phone";
import TextArea from "@/components/fields/TextArea";
import websiteData from "./data";

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="space-y-8">
      <div className="flex gap-2 mt-8 md:20 max-md:flex-col-reverse">
        <div className="bg-secondary rounded-l-xl max-w-100">
          <div className="px-4 py-8 flex flex-col gap-4">
            <h1>Get In Touch</h1>
            <p>
              We really appreciate you taking the time to get in touch. Please
              fill in the form below.
            </p>
            <h1>Contact</h1>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 items-center text-primary">
                <Phone />
                <p>{websiteData.phoneNumber}</p>
              </div>
              <div className="flex gap-2 items-center text-primary">
                <Mail />

                <p>{websiteData.mail}</p>
              </div>
              <div className="flex gap-2 items-center text-primary">
                <MapPin />
                <p>{websiteData.location}</p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <Link
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={"/svg/facebook.svg"}
                  alt="facebook logo"
                  width={32}
                  height={32}
                />
              </Link>
              <Link
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={"/svg/instagram.svg"}
                  alt="instagram logo"
                  width={32}
                  height={32}
                />
              </Link>
              <Link
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={"/svg/youtube.svg"}
                  alt="youtube logo"
                  width={32}
                  height={32}
                />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaXTwitter size={28} />
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-light-primary px-2 py-4 md:px-4 md:py-8 bg-light-blue space-y-4 rounded-r-xl flex-1">
          <h1>Leave Your Message</h1>
          <Formik initialValues={{}} onSubmit={() => {}}>
            {({ handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <div className="flex max-md:flex-col md:gap-4">
                  <Input
                    type="text"
                    label="Name"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                    className="flex-1"
                  />
                  <PhoneInput
                    name="phone"
                    placeholder="Phone"
                    onChange={handleChange}
                    className="flex-1"
                  />
                </div>

                <div className="flex max-md:flex-col md:gap-4">
                  <Input
                    type="email"
                    label="Email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="flex-1"
                  />
                  <Input
                    type="text"
                    label="Subject"
                    name="subject"
                    placeholder="Subject"
                    onChange={handleChange}
                    className="flex-1"
                  />
                </div>

                <TextArea
                  name="message"
                  label="Message"
                  placeholder="Message"
                  onChange={handleChange}
                />
                <ActionButton type="submit" loading={loading}>
                  Send Message
                </ActionButton>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.633546565547!2d85.3107034445123!3d27.697718820732277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19de9bac3663%3A0xc42dc4821a8ee33d!2sMax%20Pharma%20Pvt.Ltd!5e0!3m2!1sen!2snp!4v1744612558523!5m2!1sen!2snp"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUs;
