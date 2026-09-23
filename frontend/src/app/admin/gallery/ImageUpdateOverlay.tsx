import Gallery from "@/api/gallery";
import Button from "@/components/Button";
import Input from "@/components/fields/Input";
import MultipleUpload from "@/components/fields/MultipleUpload";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";

const ImageUpdateOverlay = ({ updateIdData, closeOverlay }: any) => {
    const [loading, setLoading] = useState(false);

    // Prepare initial files: convert gallery to array of string paths
    const initialFiles = Array.isArray(updateIdData.gallery)
        ? updateIdData.gallery.map((img: any) => img.file)
        : [];

    const [initialValues, setInitialValues] = useState({
        title: "",
        files: [],
    });

    useEffect(() => {
        if (updateIdData) {
            setInitialValues({
                title: updateIdData.title,
                files: initialFiles,
            });
        } else {
            setInitialValues({
                title: "",
                files: [],
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateIdData]);

    const submitHandler = async (values: any, { resetForm }: any) => {
        setLoading(true);

        // Prepare files array: keep string for existing, object for new
        const files = (values.files || []).map((file: any) => {
            if (typeof file === "string") {
                return file.replace(/^\/+/, "");
            }
            if (file?.url && typeof file.url === "string") {
                return file.url.replace(/^\/+/, "");
            }
            if (file?.base64 && file?.extension) {
                if (
                    typeof file.base64 === "string" &&
                    (file.base64.startsWith("http") ||
                        file.base64.startsWith("/uploads/") ||
                        file.base64.includes("/maxpharma/") ||
                        file.base64.startsWith("maxpharma/"))
                ) {
                    try {
                        const url = new URL(
                            file.base64,
                            window.location.origin
                        );
                        return url.pathname.replace(/^\/+/, "");
                    } catch {
                        return file.base64.replace(/^\/+/, "");
                    }
                }
                if (
                    typeof file.base64 === "string" &&
                    (file.base64.startsWith("data:") ||
                        /^[A-Za-z0-9+/=]{100,}/.test(file.base64))
                ) {
                    return {
                        extension: file.extension,
                        base64: file.base64,
                    };
                }
            }
            return file;
        });

        const payload = {
            title: values.title,
            files,
        };

        try {
            await Gallery.update("gallery", payload, updateIdData.id);
            resetForm();
            closeOverlay();
        } catch (error) {
            console.error("Failed to update gallery:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl relative max-h-[90vh] overflow-y-auto'>
                <button
                    onClick={closeOverlay}
                    className='absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-2xl'
                >
                    ✖
                </button>

                <Formik
                    initialValues={initialValues}
                    onSubmit={submitHandler}
                    enableReinitialize={true}
                >
                    {({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit} className='space-y-4'>
                            <Input
                                name='title'
                                label='Title'
                                placeholder='Enter title'
                            />

                            <MultipleUpload
                                name='files'
                                label='Images'
                                placeholder='Add or remove images'
                            />
                            <Button
                                type='submit'
                                loading={loading}
                                variant='submit'
                            >
                                Update
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default ImageUpdateOverlay;
