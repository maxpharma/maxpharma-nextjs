import React, { useEffect, useState } from "react";
import Image from "next/image";
import Gallery from "@/api/gallery";
import { Form, Formik } from "formik";
import { init } from "next/dist/compiled/webpack/webpack";
import Input from "@/components/fields/Input";
import Upload from "@/components/fields/Upload";
import ActionButton from "@/components/ActionButton";

interface OverlayProps {
  updateIdData: {
    id: number;
    title: string;
    gallery: {
      id: number;
      galleryId: number;
      file: string;
    }[];
  };
  closeOverlay: () => void;
}

interface FileData {
  extension: string;
  base64: string;
  fileName?: string;
  info?: string;
  type?: string;
  size?: number;
}

interface ImageFormValues {
  title: string;
  file: FileData[];
}

const ImageUpdateOverlay: React.FC<OverlayProps> = ({
  updateIdData,
  closeOverlay,
}) => {
  const [loading, setLoading] = useState(false);
  const [galleryState, setGalleryState] = useState(updateIdData.gallery);

  const deleteSingleImage = async (imageId: number) => {
    try {
      await Gallery.deleteSingleImage("gallery", imageId);
      setGalleryState((prev) => prev.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  const [initialValues, setInitialValues] = useState<ImageFormValues>({
    title: "",
    file: [],
  });

  useEffect(() => {
    if (updateIdData) {
      setInitialValues({
        title: updateIdData.title,
        file: [],
      });
    } else {
      setInitialValues({
        title: "",
        file: [],
      });
    }
  }, [updateIdData]);

  const submitHandler = async (values: any, { resetForm }: any) => {
    setLoading(true);

    const payload = {
      title: values.title,
      file: values.file.map((file: any) => ({
        extension: file.extension,
        base64: file.base64,
      })),
    };

    console.log("Payload:", payload);

    try {
      await Gallery.update("gallery", payload, updateIdData.id);
    } catch (error) {
      console.error("Failed to update gallery:", error);
    } finally {
      setLoading(false);
      closeOverlay();
      resetForm();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeOverlay}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-2xl"
        >
          ✖
        </button>

        <Formik
          initialValues={initialValues}
          onSubmit={submitHandler}
          enableReinitialize={true}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="space-y-4">
              <Input name="title" label="Title" placeholder="Enter title" />

              <p className="mb-4">
                <strong>Images:</strong> {galleryState.length} files
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryState.map((image, index) => (
                  <div key={index} className="relative h-32 w-full">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BUCKET_URL}/${image.file}`}
                      alt={`Image ${index + 1}`}
                      fill
                      className="object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => deleteSingleImage(image.id)}
                      className="absolute top-1 right-1 text-xs text-white bg-red-500 hover:bg-red-600 rounded-full w-6 h-6 flex items-center justify-center shadow-md transition-colors duration-200"
                      title="Delete Image"
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>

              <Upload
                name="file"
                label="Upload More Images"
                placeholder="Upload more images"
                variant="multiple"
              />
              <ActionButton
                type="submit"
                loading={loading}
                classname="flex justify-self-end"
              >
                Update
              </ActionButton>
            </Form>
          )}
        </Formik>

        {galleryState.length === 0 && (
          <p className="mt-6 text-center text-gray-500">
            No images remaining in this gallery.
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageUpdateOverlay;
