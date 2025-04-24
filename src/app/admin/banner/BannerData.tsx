import GeneralSettings from "@/api/generalSettings";
import { deleteIcon, editIcon } from "@/assets/svg";
import ConfirmationAlert from "@/components/ConfirmationAlert";
import CustomImage from "@/components/CustomImage";
import DataTable from "@/components/DataTable";
import SvgIcon from "@/components/SvgIcon";
import { bucketUrl } from "@/features/data";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const BannerData = ({ setUpdateIdData, openForm }: any) => {
    const fetchBanner = async () => {
        await GeneralSettings.getByGroup("banners", "banner", "")
            .then(() => {})
            .catch(() => {});
    };

    const { data: banners } = useSelector((state: any) => state.banners);

    useEffect(() => {
        if (!banners?.length) fetchBanner();
    }, [banners?.length]);

    const columns = [
        { id: "title", header: "Title", accessor: "title", maxWidth: 300 },
        { id: "link", header: "Link", accessor: "link", maxWidth: 300 },
        { id: "banner", header: "Banner", accessor: "banner", maxWidth: 300 },
        {
            id: "actions",
            header: "Actions",
            accessor: "actions",
            maxWidth: 300,
        },
    ];

    const bannerData = Array.isArray(banners)
        ? banners.map((banner: any) => ({
              id: banner.id,
              title: banner.title,
              link: banner.value,
              banner: (
                  <a
                      href={`${bucketUrl}/${banner?.file}`}
                      target='_blank'
                      rel='noopener noreferrer'
                  >
                      <CustomImage
                          src={`${process.env.NEXT_PUBLIC_BUCKET_URL}/${banner?.file}`}
                          size='small'
                          orientation='landscape'
                      />
                  </a>
              ),
              actions: (
                  <div className='flex items-center'>
                      <div
                          className='cursor-pointer p-2'
                          onClick={() => {
                              setUpdateIdData({
                                  id: banner.id,
                                  title: banner.title,
                                  link: banner.value,
                                  file: banner.file,
                              });
                              if (openForm) openForm();
                          }}
                      >
                          <SvgIcon src={editIcon} />
                      </div>
                      <div
                          className='cursor-pointer p-2'
                          onClick={() => handleDeleteClick(banner.id)}
                      >
                          <SvgIcon src={deleteIcon} />
                      </div>
                  </div>
              ),
          }))
        : [];

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setItemToDelete(id);
        setShowConfirmation(true);
    };

    const handleDelete = async () => {
        if (itemToDelete !== null) {
            await GeneralSettings.remove("banners", itemToDelete);
            setShowConfirmation(false);
        }
    };

    return (
        <>
            <div>
                <DataTable
                    title='Banners'
                    columns={columns}
                    data={bannerData}
                    emptyMessage='No banners found'
                    actions={[]}
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

export default BannerData;
