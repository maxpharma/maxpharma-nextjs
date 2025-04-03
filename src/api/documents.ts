import request from '@/utils/request';
import { ReturnType } from './types';

const create = async (state: string, data: any) => {
    try {
        const config: ReturnType = {
            url: `documents`,
            method: 'post',
            data,
            authorization: true,
            config: {
                showErr: true,
                successMsg: 'Created Successfully',
                store: {
                    action: 'prepend',
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

const getData = async (state: string) => {
    try {
        const config: ReturnType = {
            url: `documents`,
            method: 'get',
            authorization: true,
            config: {
                showErr: true,

                store: {
                    action: 'set',
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

const deleteItem = async (id: number) => {
    try {
        const config: ReturnType = {
            url: `documents/${id}`,
            method: 'delete',
            authorization: true,
            config: {
                showErr: true,
                successMsg: 'Deleted Successfully',
                store: {
                    action: 'set',
                    key: '',
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
            method: 'patch',
            data,
            authorization: true,
            config: {
                showErr: true,
                successMsg: 'Updated Successfully',
                store: {
                    action: 'update',
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

const Documents = { create, getData, deleteItem, update };

export default Documents;
