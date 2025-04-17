import request from "@/utils/request";
import { ReturnType } from "./types";

const create = async (data: any) => {
    try {
        const config: ReturnType = {
            url: `notices`,
            method: "post",
            data,
            authorization: true,
            config: {
                showErr: true,
                successMsg: "Created Successfully",
                store: {
                    action: "prepend",
                    key: "notices",
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
            url: `notices`,
            method: "get",
            authorization: true,
            config: {
                showErr: true,
                store: {
                    action: "set",
                    key: "notices",
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

const deleteItem = async (id: number) => {
    try {
        const config: ReturnType = {
            url: `notices/${id}`,
            method: "delete",
            authorization: true,
            config: {
                showErr: true,
                successMsg: "Deleted Successfully",
                store: {
                    action: "remove",
                    key: "notices",
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

const update = async (state: string, data: any, id: number) => {
    try {
        const config: ReturnType = {
            url: `documents/${id}`,
            method: "patch",
            data,
            authorization: true,
            config: {
                showErr: true,
                successMsg: "Updated Successfully",
                store: {
                    action: "update",
                    key: state,
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

const Notice = { create, get, deleteItem, update };

export default Notice;
