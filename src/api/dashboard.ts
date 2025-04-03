import request from '@/utils/request';
import { ReturnType } from './types';

const getData = async (state: string, type: string) => {
    try {
        const config: ReturnType = {
            url: `dashboard?type=${type}`,
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

const Dashboard = { getData };

export default Dashboard;
