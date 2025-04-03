import GeneralSettings from '@/api/generalSettings';
import { deleteIcon, editIcon } from '@/assets/svg';
import ConfirmationAlert from '@/components/ConfirmationAlert';
import DataTable from '@/components/DataTable';
import SvgIcon from '@/components/SvgIcon';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const VideoData = ({ setUpdateIdData }: any) => {
    const { data: videoData } = useSelector(
        (state: any) => state.videos || { data: [] }
    );

    const fetchData = async () => {
        await GeneralSettings.getByGroup('videos', 'video', '');
    };

    useEffect(() => {
        if (!videoData?.length) {
            fetchData();
        }
    }, [videoData?.length]);

    const columns = [
        { id: 'title', header: 'Title', accessor: 'title', minWidth: 170 },
        { id: 'link', header: 'Link', accessor: 'link', minWidth: 170 },
        {
            id: 'action',
            header: 'Action',
            accessor: 'action',
            minWidth: 170,
        },
    ];

    const rows = Array.isArray(videoData)
        ? videoData.map((item: any, index: number) => ({
              id: item.id || index,
              title: item.title,
              link: item.value,
              action: (
                  <div className='flex gap-2'>
                      <button
                          className='cursor-pointer'
                          onClick={() =>
                              setUpdateIdData({
                                  id: item.id,
                                  title: item.title,
                                  link: item.value,
                              })
                          }
                      >
                          <SvgIcon src={editIcon} />
                      </button>
                      <button
                          className='cursor-pointer'
                          onClick={() => handleDeleteClick(item.id)}
                      >
                          <SvgIcon src={deleteIcon} />
                      </button>
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
            await GeneralSettings.remove('videos', itemToDelete);
            setShowConfirmation(false);
        }
    };

    return (
        <>
            <div>
                <DataTable
                    title='Videos'
                    columns={columns}
                    data={rows}
                    emptyMessage='No videos found'
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

export default VideoData;
