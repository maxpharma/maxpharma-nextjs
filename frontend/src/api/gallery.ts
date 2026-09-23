import request from '@/utils/request';
import { ReturnType } from './types';

const uploadImage = async (state: string, data: any) => {
    try {
        const config: ReturnType = {
            url: `gallery`,
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

const getImage = async (state: string) => {
    try {
        const config: ReturnType = {
            url: `gallery`,
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
            url: `gallery/${id}`,
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
            url: `gallery/${id}`,
            method: 'patch',
            data,
            authorization: true,
            config: {
                showErr: true,
                successMsg: 'Updated Successfully',
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

const deleteSingleImage = async (state: string, id: number) => {
    try {
        const config: ReturnType = {
            url: `images/${id}`,
            method: 'delete',
            authorization: true,
            config: {
                showErr: true,
                successMsg: 'Deleted Successfully',
                store: {
                    action: 'remove',
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

const Gallery = {
    uploadImage,
    getImage,
    deleteItem,
    update,
    deleteSingleImage,
};

export default Gallery;
