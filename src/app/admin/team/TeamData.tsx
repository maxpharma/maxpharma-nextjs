import Team from "@/api/team";
import { deleteIcon, editIcon } from "@/assets/svg";
import ConfirmationAlert from "@/components/ConfirmationAlert";
import CustomImage from "@/components/CustomImage";
import DataTable from "@/components/DataTable";
import SvgIcon from "@/components/SvgIcon";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const TeamData = ({ setUpdatedIdData }: any) => {
    const [toggle, setToggle] = useState("directors");

    const { items: originalDirectorsData = [] } = useSelector(
        (state: any) => state[toggle]
    );

    const directorsData = [...originalDirectorsData].reverse();

    const fetchTeamData = async (type: string) => {
        await Team.getData(toggle, type);
    };

    useEffect(() => {
        fetchTeamData(toggle);
    }, [toggle]);

    const columns = [
        {
            id: "profile",
            header: "Profile",
            accessor: "profile",
            minWidth: 170,
        },
        { id: "name", header: "Name", accessor: "name", minWidth: 170 },
        { id: "role", header: "Role", accessor: "role", minWidth: 170 },
        {
            id: "companyName",
            header: "Company Name",
            accessor: "companyName",
            minWidth: 170,
        },
        { id: "action", header: "Action", accessor: "action", minWidth: 170 },
    ];

    const rows = directorsData?.map((item: any) => {
        return {
            id: item.id,
            profile: (
                <CustomImage
                    src={`${process.env.NEXT_PUBLIC_BUCKET_URL}/${item?.image}`}
                    size='small'
                    orientation='portrait'
                />
            ),
            name: item.additionalInfo.name,
            role: item.additionalInfo.role,
            companyName: item.additionalInfo.companyName,
            action: (
                <div className='flex items-center gap-2'>
                    <div
                        className='cursor-pointer'
                        onClick={() => {
                            setUpdatedIdData({
                                id: item.id,
                                name: item.additionalInfo.name,
                                role: item.additionalInfo.role,
                                companyName: item.additionalInfo.companyName,
                                image: item.image,
                            });
                        }}
                    >
                        <SvgIcon src={editIcon} />
                    </div>
                    <div
                        className='cursor-pointer'
                        onClick={() => handleDeleteClick(item.id)}
                    >
                        <SvgIcon src={deleteIcon} />
                    </div>
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
            await Team.deleteItem(itemToDelete);
            setShowConfirmation(false);
            // Optionally refresh the data
            fetchTeamData(toggle);
        }
    };

    return (
        <>
            <div>
                <div className='flex gap-2 mb-4'>
                    <button
                        className={`${
                            toggle === "directors"
                                ? "active-button"
                                : "inactive-button"
                        } `}
                        onClick={() => setToggle("directors")}
                    >
                        Board of Directors
                    </button>
                    <button
                        className={`${
                            toggle === "team"
                                ? "active-button"
                                : "inactive-button"
                        } `}
                        onClick={() => setToggle("team")}
                    >
                        Management Team
                    </button>
                </div>
                <DataTable
                    title={
                        toggle === "directors"
                            ? "Board of Directors"
                            : "Management Team"
                    }
                    columns={columns}
                    data={rows}
                    emptyMessage='No data found'
                />
            </div>
            {showConfirmation && (
                <ConfirmationAlert
                    message='Are you Sure you want to Delete This Data ?'
                    confirmText='YES'
                    cancelText='NO'
                    onConfirm={() => handleDelete()} // Pass as a function reference
                    onCancel={() => setShowConfirmation(false)}
                />
            )}
        </>
    );
};

export default TeamData;
