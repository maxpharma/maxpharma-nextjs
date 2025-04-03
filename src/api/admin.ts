import request from '@/utils/request';
import { ReturnType } from './types';
const login = async (data: any) => {
    try {
        const config: ReturnType = {
            url: 'admins/login',
            method: 'post',
            data,
            config: {
                showErr: true,
                successMsg: 'Login successful!',
                store: {
                    action: 'set',
                    key: 'user',
                },
            },
        };

        const response = await request(config);
        return response;
    } catch (err: any) {
        throw new Error(err.message);
    }
};
const changePassword = async (data: any) => {
    try {
        const config: ReturnType = {
            url: 'admins/change-password',
            method: 'patch',
            authorization: true,
            data,
            config: {
                showErr: true,
                successMsg: 'Password changed successful!',
            },
        };

        const response = await request(config);
        return response;
    } catch (err: any) {
        throw new Error(err.message);
    }
};
const logout = async () => {
    try {
        const config: ReturnType = {
            url: 'admins/logout',
            method: 'post',
            authorization: true,
            config: {
                successMsg: 'Logout successful!',
                showErr: true,
                store: {
                    key: 'user',
                    action: 'reset',
                },
            },
        };
        const response = await request(config);
        return response;
    } catch (err: any) {
        throw new Error(err.message);
    }
};

const Admin = { login, changePassword, logout };

export default Admin;
