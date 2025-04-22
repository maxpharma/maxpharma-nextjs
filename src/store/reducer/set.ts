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
        // Handles paginated responses
        return {
            ...oldData,
            items: data.items,
            totalItems: data.totalItems,
            totalPages: data.totalPages,
            page: data.page,
            loading: false,
        };
    }

    // 🔥 If oldData is an array, assume we're appending a new item
    if (Array.isArray(oldData)) {
        return [...oldData, data];
    }

    // Existing default logic
    if (!!loadingState) {
        return {
            ...oldData,
            data: data,
            loading: false,
        };
    }

    return data;
};

export default set;
