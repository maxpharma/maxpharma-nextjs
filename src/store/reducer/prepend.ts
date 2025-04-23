const prepend = ({ data, loadingState, oldData, draft }: any) => {
    if (!!loadingState || !!draft?.items || !!draft?.data) {
        if (!!draft?.items) {
            if (!!data?.items && Array.isArray(data?.items)) {
                return {
                    ...oldData,
                    ...data,
                    items: [...data?.items, ...oldData?.items],
                    loading: false,
                };
            } else {
                return {
                    ...oldData,
                    items: [data, ...(oldData?.items || [])],
                    totalItems: (oldData?.totalItems || 0) + 1,
                    loading: false,
                };
            }
        } else {
            return {
                ...oldData,
                data: [data, ...(oldData?.data || [])],
                loading: false,
            };
        }
    } else {
        return [data, ...oldData];
    }
};

export default prepend;
