import Popup from "@/api/popup";
import { deleteIcon } from "@/assets/svg";
import ConfirmationAlert from "@/components/ConfirmationAlert";
import CustomImage from "@/components/CustomImage";
import DataTable from "@/components/DataTable";
import SvgIcon from "@/components/SvgIcon";
import Toggle from "@/components/ui/Toggle";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const PopupData = () => {
    const fetchData = async () => {
        await Popup.getData("popup");
    };

    const { items: popupData } = useSelector((state: any) => state.popup || []);

    useEffect(() => {
        if (!popupData?.length) {
            fetchData();
        }
    }, [popupData?.length]);

    const columns = [
        { id: "image", header: "Image", accessor: "image", minWidth: 170 },
        { id: "status", header: "Status", accessor: "status", minWidth: 170 },
        { id: "action", header: "Action", accessor: "action", minWidth: 170 },
    ];

    const handleToggleChange = async (newState: boolean, id: number) => {
        try {
            if (newState) {
                const otherActivePopup = popupData.find(
                    (item: any) => item.status === true && item.id !== id
                );

                if (otherActivePopup) {
                    toast.error("Only one popup can be active at a time.");

                    return;
                }
            }

            await Popup.update("popup", { status: newState }, id);
            fetchData();
        } catch (error) {
            console.error("Failed to update popup status:", error);
        }
    };

    const rows = popupData?.map((item: any) => {
        return {
            id: item?.id,
            image: (
                <CustomImage
                    src={`${process.env.NEXT_PUBLIC_BUCKET_URL}/${item?.image}`}
                    size='small'
                />
            ),
            status: (
                <Toggle
                    value={item?.status}
                    onChange={(newState: boolean) =>
                        handleToggleChange(newState, item.id)
                    }
                />
            ),

            action: (
                <div>
                    <button
                        onClick={() => {
                            handleDeleteClick(item.id);
                        }}
                        className='cursor-pointer'
                    >
                        <SvgIcon src={deleteIcon} />
                    </button>
                </div>
            ),
        };
    });

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setItemToDelete(id);
        setShowConfirmation(true);
    };

    const handleDelete = async () => {
        if (itemToDelete !== null) {
            await Popup.deleteItem("popup", itemToDelete);
            setShowConfirmation(false);

            fetchData();
        }
    };

    return (
        <>
            <div>
                <DataTable
                    columns={columns}
                    data={rows}
                    title='Popup Data'
                    emptyMessage='No Popup Data Found'
                />
            </div>
            {showConfirmation && (
                <ConfirmationAlert
                    message='Are you Sure you want to Delete This Data ?'
                    confirmText='YES'
                    cancelText='NO'
                    onConfirm={() => handleDelete()}
                    onCancel={() => setShowConfirmation(false)}
                />
            )}
        </>
    );
};

export default PopupData;
