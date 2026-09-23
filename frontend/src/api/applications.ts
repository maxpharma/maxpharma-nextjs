import request from '@/utils/request';
import { ReturnType } from './types';

const create = async (state: string, data: any) => {
    try {
        const config: ReturnType = {
            url: `applications`,
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

const getAll = async (state: string) => {
    try {
        const config: ReturnType = {
            url: `applications`,
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
            url: `applications/${id}`,
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

const Applications = {
    create,
    getAll,
    deleteItem,
};

export default Applications;
