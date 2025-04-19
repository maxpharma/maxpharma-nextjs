import axios from "axios";
import { store, Actions } from "../store";
import { toast } from "react-toastify";
import helper from "./helper";

const isBrowser = typeof window !== "undefined"; // ✅ Safe check

const APP_BASE_URL: string = process.env.NEXT_PUBLIC_APP_BASE_URL || "";

const storeProcess = async (config: any, data: any) => {
    if (!isBrowser) return; // Ensure this runs only in the browser, for seo
    const actionType: "set" | "append" | "update" | "remove" | "reset" =
        config.action;
    if (actionType !== "reset") {
        store.dispatch(Actions[actionType](config.key, data));
    } else {
        store.dispatch(Actions["reset"](config.key));
    }
};

const loadingProcess = async (config: any, loading = false) => {
    if (!isBrowser) return; // Skip in server
    if (!!config?.store) {
        const actionType: "set" | "update" | "remove" | "reset" =
            config?.store?.action;
        if (actionType === "set" || actionType === "update") {
            const loadingData: any = {
                loading: loading,
                loadingState: true,
            };
            store.dispatch(
                Actions[actionType](config?.store?.key, loadingData)
            );
        }
    }
};

const request = async (configuration: any) => {
    const { authorization, config, ...restConfiguration } = configuration;

    const defaultHeader: any = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Api-Key": process.env.API_KEY,
    };

    let adminPath = "";
    if (isBrowser) {
        adminPath = window.location.pathname;
    }

    if (!!authorization && adminPath.startsWith("/admin/")) {
        const user = helper.getUser();
        if (!user?.token) {
            toast.error("No token found");
            throw new Error("No token found");
        }
        defaultHeader.Authorization = `Bearer ${user?.token}`;
    }

    await loadingProcess(configuration, true);
    return await axios({
        ...restConfiguration,
        url: `${APP_BASE_URL}/${restConfiguration?.url.toString()}`,
        headers: defaultHeader,
    })
        .then(async (resp) => {
            if (!!resp?.data?.errors) {
                throw new Error(resp?.data?.errors[0]?.message);
            }
            const data = resp?.data?.data;
            if (!!config.store) {
                await storeProcess(config.store, data);
            }
            if (!!config.successMsg) {
                toast.success(configuration?.config?.successMsg);
            }
            return data;
        })
        .catch(async (err) => {
            const message =
                err.response?.data?.message ||
                err.response?.data?.errors?.[0]?.message ||
                err?.message;

            if (!!config?.showErr) {
                toast.error(message);
            }

            if (err?.response?.status === 401 || message == "Unauthorized") {
                if (
                    isBrowser &&
                    window.location.pathname.startsWith("/admin")
                ) {
                    window.location.href = "/admin";
                }
            } else {
                await loadingProcess(config, false);
            }

            throw new Error(message); // ✅ throw the message string, not the whole error
        });
};

export default request;
