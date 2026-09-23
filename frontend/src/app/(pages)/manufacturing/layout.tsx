"use client";

import GeneralSettings from "@/api/generalSettings";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const router = useRouter();

  const { data: serviceCategories } = useSelector(
    (state: any) => state.serviceCategories || []
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    serviceCategories[0]?.id
  );

  const fetchData = async () => {
    await GeneralSettings.getByGroup("serviceCategories", "serviceCategories");
  };

  useEffect(() => {
    if (!serviceCategories?.length) {
      fetchData();
    }
  }, [serviceCategories?.length]);

  const aboutNavItems = serviceCategories.map((item: any) => ({
    id: item.id,
    name: item.value,
    path: `/manufacturing/${decodeURIComponent(item?.infos?.seoUrl)}`,
  }));

  const [title, setTitle] = useState("Manufacturing");

  useEffect(() => {
    const check = serviceCategories.find(
      (item: any) =>
        item?.infos?.seoUrl === decodeURIComponent(params?.service as string)
    );

    if (check) {
      setTitle(check.value);
    } else {
      setTitle("Manufacturing");
    }
  }, [params?.service, serviceCategories]);

  return (
    <>
      <div>
        <div className={`mx-auto w-[98vw] bg-light-primary rounded-xl py-8 $`}>
          <div className="px-4 flex flex-col items-center gap-8">
            <h1>{title}</h1>

            <div className="flex flex-wrap justify-center gap-1 md:gap-2">
              {aboutNavItems.map((item: any) => {
                const isActive =
                  item?.infos?.seoUrl ==
                  decodeURIComponent(params?.service as string);

                return (
                  <div
                    key={item.name}
                    onClick={() => {
                      setSelectedCategoryId(item.id);
                      router.push(item.path);
                    }}
                    className={`
                  px-4 py-2 rounded-md text-sm font-medium transition duration-200 cursor-pointer
                  ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-white text-primary hover:bg-blue-100"
                  }
                `}
                  >
                    {item.name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="custom-container mt-4">{children}</div>
    </>
  );
};

export default Layout;
