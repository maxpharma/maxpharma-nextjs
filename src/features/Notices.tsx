"use client";

import Button from "@/components/Button";
import Upload from "@/components/fields/Upload";
import Overlay from "@/components/Overlay";
import React, { useState } from "react";
import ApplyNow from "./ApplyNow";

const Notices = ({ limit }: { limit: number }) => {
  const data = [
    {
      date: "2023-10-01",
      title: "Notice 1",
      description: "Description for notice 1",
      link: "https://example.com/notice1",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      {Array(limit)
        .fill(data)
        .map((item, index) => (
          <Items key={index} {...item[0]} />
        ))}
    </div>
  );
};
export default Notices;

const Items = ({ date, title, description, link }: any) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  return (
    <>
      <div className="relative shadow-xs rounded-lg p-2">
        <div className="p-4 flex justify-between">
          <div className="flex-1">
            <div>{title}</div>
            <div className="text-primary text-xs">{date}</div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-4 justify-center">
              <button className="secondary-button ">Learn More</button>
              <button
                className="button"
                onClick={() => {
                  setIsOverlayOpen(true);
                }}
              >
                Apply now
              </button>
            </div>
          </div>
        </div>
      </div>
      {isOverlayOpen && (
        <Overlay isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)}>
          <ApplyNow />
        </Overlay>
      )}
    </>
  );
};
