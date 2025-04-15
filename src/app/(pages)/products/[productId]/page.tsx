"use client";

import Button from "@/components/Button";
import CustomImage from "@/components/CustomImage";
import Input from "@/components/fields/Input";
import PhoneInput from "@/components/fields/Phone";
import TextArea from "@/components/fields/TextArea";
import Overlay from "@/components/Overlay";
import Categories from "@/features/Categories";
import Products from "@/features/Products";
import { Form, Formik } from "formik";
import { sub } from "framer-motion/client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { BsWhatsapp } from "react-icons/bs";

const ProductDetailPage = () => {
  const { productId } = useParams();

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  return (
    <>
      <div className="py-6 space-y-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex sm:flex-col order-2 sm:order-1 gap-4 overflow-x-auto sm:overflow-y-auto sm:h-100 ">
                {[1, 2, 3, 4].map((index) => (
                  <CustomImage
                    key={index}
                    src="/images/medicine.png"
                    className="w-22 h-22 sm:w-16  md:w-20  lg:w-24  flex-shrink-0 cursor-pointer border border-gray-200 rounded-sm hover:border-gray-400"
                    fit="cover"
                  />
                ))}
              </div>

              <div className="order-1 sm:order-2 flex-grow">
                <CustomImage
                  src="/images/medicine.png"
                  className="w-full h-64 sm:h-80 lg:h-100  rounded-lg"
                  fit="cover"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4 w-full lg:w-1/2">
            <span className="font-medium text-sm">
              Antibiotics & Antimicrobials
            </span>

            <div className="text-xl sm:text-2xl font-semibold">
              Levotech IV-500mg
            </div>

            <div className="spacey-y-1">
              <div className="text-lg font-medium">Specifications</div>

              <table className="w-full border-collapse">
                <tbody>
                  {[1, 2, 3, 4, 5].map((index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 flex flex-row justify-between py-2 "
                    >
                      <td className="text-gray-600 text-sm sm:text-base">
                        Brand name
                      </td>
                      <td className="font-medium text-sm sm:text-base">
                        Brand name
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-4 pt-4">
              <button className="secondary-button w-full flex items-center justify-center gap-2 py-2.5">
                <BsWhatsapp className="text-lg" />
                <span>Whatsapp</span>
              </button>
              <button
                className="button w-full py-2.5"
                onClick={() => setIsOverlayOpen(true)}
              >
                Send Inquiry
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h1>Product Overview</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur. Urna etiam posuere dui non
            viverra nullam. Egestas nisl adipiscing platea velit diam quam
            ullamcorper. Pellentesque enim risus eget augue massa. Metus sem
            vulputate euismod dolor. Mattis odio dolor et sed facilisis lectus
            orci elit. Vel volutpat in duis turpis id enim donec feugiat
            pulvinar. Amet adipiscing a donec quis potenti vulputate. Ut
            vestibulum enim ultrices sed augue pretium adipiscing aliquam
            feugiat.
          </p>
        </div>
        <section className="space-y-4">
          <h1>Our Products</h1>
          <Categories />
          <Products limit={4} />
        </section>
      </div>
      {isOverlayOpen && (
        <Overlay onClose={() => setIsOverlayOpen(false)} isOpen={isOverlayOpen}>
          <div className="space-y-4 ">
            <h1>Interested in Our Products</h1>
            <Formik
              initialValues={{
                name: "",
                phone: "",
                email: "",
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
        </Overlay>
      )}
    </>
  );
};

export default ProductDetailPage;
