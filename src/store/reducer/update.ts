const update = ({
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
    if (draft?.items) {
        const findIndex = oldData?.items?.findIndex(
            (item: any) => item?.id === data?.id
        );
        if (findIndex > -1 && !!oldData?.items[findIndex]) {
            draft.items[findIndex] = {
                ...oldData?.items[findIndex],
                ...data,
            };
            return draft;
        }
    } else {
        if (!!loadingState) {
            return {
                ...oldData,
                data: { ...oldData?.data, ...data },
                loading: false,
            };
        } else {
            return {
                ...oldData,
                ...data,
            };
        }
    }
};

export default update;
