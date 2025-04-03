const set = ({
    data,
    loadingState,
    oldData,
}: {
    data: any;
    loadingState: boolean;
    oldData: any;
}) => {
    if (data?.items) {
        return {
            ...oldData,
            items: data?.items,
            totalItems: data?.totalItems,
            totalPages: data?.totalPages,
            page: data?.page,
            loading: false,
        };
    } else {
        if (!!loadingState) {
            return {
                ...oldData,
                data: data,
                loading: false,
            };
        } else {
            return data;
        }
    }
};

export default set;
