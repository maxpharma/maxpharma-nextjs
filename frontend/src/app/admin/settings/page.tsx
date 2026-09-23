"use client";

import React, { useState } from "react";
import Theme from "./Theme";
import Setting from "./Setting";

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState("Theme");

    return (
        <div className='space-y-4'>
            <h1>Settings</h1>

            <div className='flex gap-4 items-center'>
                <button
                    className={`${
                        activeTab === "Theme"
                            ? "active-button"
                            : "inactive-button"
                    } px-4 py-2 rounded-md border`}
                    onClick={() => setActiveTab("Theme")}
                >
                    Theme
                </button>
                <button
                    className={`${
                        activeTab === "Settings"
                            ? "active-button"
                            : "inactive-button"
                    } px-4 py-2 rounded-md border`}
                    onClick={() => setActiveTab("Settings")}
                >
                    Settings
                </button>
            </div>

            <div>
                {activeTab === "Theme" && <Theme />}
                {activeTab === "Settings" && <Setting />}
            </div>
        </div>
    );
};

export default SettingsPage;
