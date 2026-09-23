import request from "@/utils/request";
import { ReturnType } from "./types";

const create = async (state: string, data: any) => {
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

const get = async (state: string, type: string) => {
    try {
        const encodedType = encodeURIComponent(type);
        const config: ReturnType = {
            url: `about-us?type=${encodedType}`,
            method: "get",
            authorization: true,
            config: {
                showErr: true,
                store: {
                    action: "set",
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

const update = async (state: string, id: number, data: any) => {
    try {
        const config: ReturnType = {
            url: `about-us/${id}`,
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

const AboutUs = {
    create,
    get,
    update,
};

export default AboutUs;
