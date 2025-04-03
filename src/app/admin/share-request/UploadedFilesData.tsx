import GeneralSettings from '@/api/generalSettings';
import { deleteIcon } from '@/assets/svg';
import ConfirmationAlert from '@/components/ConfirmationAlert';
import DataTable from '@/components/DataTable';
import SvgIcon from '@/components/SvgIcon';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const UploadedFilesData = () => {
    const { data: filesData } = useSelector(
        (state: any) => state.shareUploadedFiles || []
    );

    const fetchData = async () => {
        await GeneralSettings.getByGroup('shareUploadedFiles', 'shares', '');
    };

    useEffect(() => {
        if (!filesData.length) {
            fetchData();
        }
    }, [filesData.length]);

    const columns = [
        {
            id: 'type',
            header: 'Type',
            accessor: 'type',
            minWidth: 170,
        },
        {
            id: 'file',
            header: 'File',
            accessor: 'file',
            minWidth: 170,
        },
        {
            id: 'action',
            header: 'Actions',
            accessor: 'action',
            minWidth: 170,
        },
    ];

    // const rows = filesData.map((item: any) => ({
    //     type: item.value,
    //     file: item.file,
    //     action: (
    //         <div className='flex gap-2'>
    //             <button
    //                 className='cursor-pointer'
    //                 onClick={() => {
    //                     handleDeleteClick(item.id);
    //                 }}
    //             >
    //                 <SvgIcon src={deleteIcon} />
    //             </button>
    //         </div>
    //     ),
    // }));

    const rows = Array.isArray(filesData)
        ? filesData.map((item: any) => {
              return {
                  id: item.id,
                  type: item.value,
                  file: (
                      <a
                          href={`${process.env.NEXT_PUBLIC_BUCKET_URL}/${item.file}`}
                          target='_blank'
                          rel='noopener noreferrer'
                      >
                          {item.file}
                      </a>
                  ),
                  action: (
                      <div className='flex gap-2'>
                          <button
                              className='cursor-pointer'
                              onClick={() => {
                                  handleDeleteClick(item.id);
                              }}
                          >
                              <SvgIcon src={deleteIcon} />
                          </button>
                      </div>
                  ),
              };
          })
        : [];

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setItemToDelete(id);
        setShowConfirmation(true);
    };

    const handleDelete = async () => {
        if (itemToDelete !== null) {
            await GeneralSettings.remove('shares', itemToDelete);
            setShowConfirmation(false);
            // Optionally refresh the data
            fetchData();
        }
    };

    return (
        <>
            <DataTable columns={columns} data={rows} title='Uploaded Files' />
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

export default UploadedFilesData;
