import request from "@/utils/request";
import { ReturnType } from "./types";

const create = async (data: any) => {
    try {
        const config: ReturnType = {
            url: `about-us`,
            method: "post",
            data,
            authorization: true,
            config: {
                showErr: true,
                successMsg: "Created Successfully",
                store: {
                    action: "set",
                    key: "aboutUs",
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

const get = async (type: string) => {
    try {
        const config: ReturnType = {
            url: `about-us?type=${type}`,
            method: "get",
            authorization: true,
            config: {
                showErr: true,
                store: {
                    action: "set",
                    key: "aboutUs",
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

const getById = async (id: number) => {
    try {
        const config: ReturnType = {
            url: `about-us/${id}`,
            method: "get",
            authorization: true,
            config: {
                showErr: true,
                store: {
                    action: "set",
                    key: "aboutUs",
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

const AboutUs = {
    create,
    get,
    getById,
};

export default AboutUs;
