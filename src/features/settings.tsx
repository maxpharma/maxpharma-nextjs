import GeneralSettings from "@/api/generalSettings";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Settings = () => {
    const { data: settingsData } = useSelector((state: any) => state.settings);

    const fetchData = async () => {
        await GeneralSettings.getByGroup("settings", "max-pharma-settings");
    };

    useEffect(() => {
        if (!settingsData?.length) {
            fetchData();
        }
    }, [settingsData?.length]);
    return {
        mail: settingsData[0]?.infos?.mail || "",
        location: settingsData[0]?.infos?.location || "",
        tiktokLink: settingsData[0]?.infos?.tiktokLink || "",
        youtubeLink: settingsData[0]?.infos?.youtubeLink || "",
        phoneNumber: settingsData[0]?.infos?.phoneNumber || "",
        phoneNumberII: settingsData[0]?.infos?.phoneNumberII || "",
        whatsAppNumber: settingsData[0]?.infos?.whatsAppNumber || "",
        facebookLink: settingsData[0]?.infos?.facebookLink || "",
        linkedinLink: settingsData[0]?.infos?.linkedinLink || "",
        instagramLink: settingsData[0]?.infos?.instagramLink || "",
        copyrightText: settingsData[0]?.infos?.copyrightText || "",
    };
};

export default Settings;
