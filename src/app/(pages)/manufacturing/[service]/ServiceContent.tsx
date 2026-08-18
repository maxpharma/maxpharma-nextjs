"use client";

import GeneralSettings from "@/api/generalSettings";
import Services from "@/api/services";
import { bucketUrl } from "@/features/data";
import GalleryCard from "@/features/GalleryCard";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const ServiceContents = () => {
  const params = useParams();
  const { data: serviceCategories } = useSelector(
    (state: any) => state.serviceCategories || []
  );

  const fetchData = async () => {
    await GeneralSettings.getByGroup("serviceCategories", "serviceCategories");
  };
  const selectedCategory = serviceCategories?.find(
    (category: any) =>
      category?.infos?.seoUrl == decodeURIComponent(params?.service as string)
  );

  const { items: servicesData } = useSelector(
    (state: any) => state.services || []
  );
  useEffect(() => {
    if (selectedCategory?.id) {
      Services.get(selectedCategory?.id);
    }
  }, [selectedCategory?.id]);

  useEffect(() => {
    if (!serviceCategories?.length) {
      fetchData();
    }
  }, [serviceCategories?.length]);
  return (
    <section>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-12 lg:items-center">
        <div className="w-full lg:w-6/10 flex flex-col gap-2 md:gap-6">
          <h1>{servicesData[0]?.title}</h1>
          <div
            dangerouslySetInnerHTML={{
              __html: servicesData[0]?.description || "",
            }}
            className="space-y-4"
          />
        </div>
        <div className="lg:w-4/10">
          <GalleryCard
            images={
              servicesData[0]?.files?.map(
                (image: any) => `${bucketUrl}/${image}`
              ) || []
            }
          />
        </div>
      </div>
    </section>
  );
};

export default ServiceContents;
