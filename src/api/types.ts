export interface Config {
    store?: {
        action?: 'update' | 'reset' | 'set' | 'remove' | 'append' | 'prepend';
        key: string;
        loading?: boolean;
    };
    successMsg?: string;
    showErr?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (err: Error, errMsg: string) => void;
}

export interface ReturnType {
    url?: string;
    method?: 'post' | 'get' | 'patch' | 'delete';
    data?: any;
    params?: any;
    authorization?: boolean;
    config?: Config;
}
