import request from "@/utils/request";
import { ReturnType } from "./types";

const create = async (data: any) => {
    try {
        const config: ReturnType = {
            url: `products`,
            method: "post",
            data,
            authorization: true,
            config: {
                showErr: true,
                successMsg: "Created Successfully",
                store: {
                    action: "set",
                    key: "products",
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

const get = async (categoryId?: number) => {
    try {
        const config: ReturnType = {
            url: `${
                categoryId ? `products?categoryId=${categoryId}` : "products"
            }`,
            method: "get",
            authorization: true,
            config: {
                showErr: true,
                store: {
                    action: "set",
                    key: "products",
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const getById = async (id: number) => {
    try {
        const config: ReturnType = {
            url: `products/${id}`,
            method: "get",
            authorization: true,
            config: {
                showErr: true,
                store: {
                    action: "set",
                    key: "singleProduct",
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const update = async (id: number, data: any) => {
    try {
        const config: ReturnType = {
            url: `products/${id}`,
            method: "patch",
            data,
            authorization: true,
            config: {
                showErr: true,
                successMsg: "Updated Successfully",
                store: {
                    action: "update",
                    key: "products",
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const deleteItem = async (id: number) => {
    try {
        const config: ReturnType = {
            url: `products/${id}`,
            method: "delete",
            authorization: true,
            config: {
                showErr: true,
                successMsg: "Deleted Successfully",
                store: {
                    action: "remove",
                    key: "products",
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

const Products = { create, get, update, deleteItem, getById };

export default Products;
