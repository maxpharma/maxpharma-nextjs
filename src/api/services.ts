import request from "@/utils/request";
import { ReturnType } from "./types";

const create = async (data: any) => {
    try {
        const config: ReturnType = {
            url: `services`,
            method: "post",
            data,
            authorization: true,
            config: {
                showErr: true,
                successMsg: "Created Successfully",
                store: {
                    action: "set",
                    key: "services",
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

const get = async (id: number | null) => {
    try {
        const config: ReturnType = {
            url: `services?categoryId=${id}`,
            method: "get",
            authorization: true,
            config: {
                showErr: true,
                store: {
                    action: "set",
                    key: "services",
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

const update = async (data: any, id: number) => {
    try {
        const config: ReturnType = {
            url: `services/${id}`,
            method: "patch",
            data,
            authorization: true,
            config: {
                showErr: true,
                successMsg: "Updated Successfully",
                store: {
                    action: "set",
                    key: "services",
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

const getbyId = async (id: number | null) => {
    try {
        const config: ReturnType = {
            url: `services/${id}`,
            method: "get",
            authorization: true,
            config: {
                showErr: true,
                store: {
                    action: "set",
                    key: "currentService",
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

const Services = { create, get, update, getbyId };

export default Services;
