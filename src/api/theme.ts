import request from "@/utils/request";
import { ReturnType } from "./types";

const create = async (data: any) => {
    try {
        const config: ReturnType = {
            url: `themes`,
            method: "post",
            data,
            authorization: true,
            config: {
                showErr: true,
                successMsg: "Created Successfully",
                store: {
                    action: "prepend",
                    key: "themes",
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

const get = async () => {
    try {
        const config: ReturnType = {
            url: `themes`,
            method: "get",
            authorization: true,
            config: {
                showErr: true,
                store: {
                    action: "set",
                    key: "themes",
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

const update = async (id: number, data: any) => {
    try {
        const config: ReturnType = {
            url: `themes/${id}`,
            method: "patch",
            data,
            authorization: true,
            config: {
                showErr: true,
                successMsg: "Updated Successfully",
                store: {
                    action: "update",
                    key: "themes",
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

const ThemeApi = { create, get, update };

export default ThemeApi;
