import ThemeApi from "@/api/theme";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const WebsiteData = () => {
    const { items: themes } = useSelector((state: any) => state.themes);

    const fetchData = async () => {
        await ThemeApi.get();
    };

    useEffect(() => {
        if (!themes?.length) {
            fetchData();
        }
    }, [themes?.length]);

    return {
        headerLogo: themes[0]?.header || "",
        footerLogo: themes[0]?.footer || "",
        footerText: themes[0]?.footerText || "",
        primaryColor: themes[0]?.primaryColor || "#7d8e23",
        primaryLightColor: themes[0]?.primaryLightColor || "#fafbea",
        secondaryColor: themes[0]?.secondaryColor,
    };
};

export default WebsiteData;
