import request from "@/utils/request";
import { ReturnType } from "./types";

const create = async (data: any) => {
    try {
        const config: ReturnType = {
            url: `inquiries`,
            method: "post",
            data,
            authorization: true,
            config: {
                showErr: true,
                successMsg: "Inquiry sent Successfully",
                store: {
                    action: "set",
                    key: "inquiries",
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
            url: `inquiries`,
            method: "get",
            authorization: true,
            config: {
                showErr: true,
                store: {
                    action: "set",
                    key: "inquiries",
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
            url: `inquiries/${id}`,
            method: "delete",
            authorization: true,
            config: {
                showErr: true,
                successMsg: "Deleted Successfully",
                store: {
                    action: "remove",
                    key: "inquiries",
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

const Inquiry = { create, get, deleteItem };

export default Inquiry;
