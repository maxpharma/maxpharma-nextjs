import request from '@/utils/request';
import { ReturnType } from './types';

const create = async (state: string, data: any) => {
    try {
        const config: ReturnType = {
            url: `portfolios`,
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
const getList = async (state: string) => {
    try {
        const config: ReturnType = {
            url: `portfolios`,
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
const getSingle = async (state: string, id: number) => {
    try {
        const config: ReturnType = {
            url: `portfolios/${id}`,
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
            url: `portfolios/${id}`,
            method: 'delete',

            authorization: true,
            config: {
                showErr: true,
                successMsg: 'Deleted Successfully',
                store: {
                    action: 'remove',
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
            url: `portfolio/${id}`,
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

const Portfolio = {
    create,
    getList,
    getSingle,
    deleteItem,
    update,
};

export default Portfolio;
