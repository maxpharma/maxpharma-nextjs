"use client";

import React, { useState } from "react";
import Overview from "./Overview";
import Vision from "./Vision";
import MessageChairperson from "./MessageChairperson";

const AboutPage = () => {
  const [type, setType] = useState("Overview");

  return (
    <div className="space-y-4">
      <h1>About Us</h1>
      <div className="flex gap-4 items-center">
        <button
          className={`${
            type === "Overview" ? "active-button" : "inactive-button"
          }`}
          onClick={() => setType("Overview")}
        >
          Overview
        </button>
        {/* Our Vision */}
        <button
          className={`${
            type === "Our Vision" ? "active-button" : "inactive-button"
          }`}
          onClick={() => setType("Our Vision")}
        >
          Our Vision
        </button>
        {/* Message from Chairperson */}
        <button
          className={`${
            type === "Message from Chairperson"
              ? "active-button"
              : "inactive-button"
          }`}
          onClick={() => setType("Message from Chairperson")}
        >
          Message from Chairperson
        </button>
      </div>
      <div>
        {type === "Overview" && <Overview type={type} />}
        {type === "Our Vision" && <Vision type={type} />}
        {type === "Message from Chairperson" && (
          <MessageChairperson type={type} />
        )}
      </div>
    </div>
  );
};

export default AboutPage;
