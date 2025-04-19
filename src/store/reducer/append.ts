const append = ({
    data,
    loadingState,
    oldData,
    draft,
}: {
    data: any;
    loadingState: boolean;
    oldData: any;
    draft: any;
}) => {
    if (!!loadingState) {
        // Handle shape with items array (pagination-type object)
        if (draft?.items) {
            if (Array.isArray(data?.items)) {
                return {
                    ...oldData,
                    ...data,
                    items: [...(oldData?.items || []), ...data.items],
                    loading: false,
                };
            } else {
                return {
                    ...oldData,
                    items: [...(oldData?.items || []), data],
                    totalItems: (oldData?.totalItems || 0) + 1,
                    loading: false,
                };
            }
        } else {
            return {
                ...oldData,
                data: [...(oldData?.data || []), data],
                loading: false,
            };
        }
    } else {
        // Handle plain array-style append
        const safeOldData = Array.isArray(oldData) ? oldData : [];
        const safeNewData = Array.isArray(data) ? data : [data];
        return [...safeOldData, ...safeNewData];
    }
};
