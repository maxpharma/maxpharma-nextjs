import removeFile from "./removeFile";
import uploadFile from "./uploadFile";

const uploadMultipleImage = async (
  items: any[],
  dynamicPath: string,
  oldImages?: any[],
) => {
  if (!Array.isArray(items)) return items;

  const data = await Promise.all(
    items.map(async (value: any, index: number) => {
      // 1. If string, it's already an uploaded key or URL
      if (typeof value === "string") {
        try {
          if (value.startsWith("http://") || value.startsWith("https://")) {
            const url = new URL(value);
            return url.pathname.replace(/^\/+/, "");
          }
        } catch {
          // ignore
        }
        return value.replace(/^\/+/, "");
      }

      // 2. If object with base64
      if (value?.base64) {
        const str = String(value.base64);
        if (
          str.startsWith("http://") ||
          str.startsWith("https://") ||
          str.includes("/maxpharma/") ||
          str.startsWith("maxpharma/")
        ) {
          try {
            const url = new URL(str);
            return url.pathname.replace(/^\/+/, "");
          } catch {
            return str.replace(/^\/+/, "");
          }
        }

        // It is a real base64 upload
        if (oldImages?.length && oldImages[index]) {
          await removeFile({ filePath: oldImages[index] });
        }

        const extension = value?.extension || "webp";
        const finalImage = await uploadFile({
          filePath: dynamicPath,
          fileName: `${Date.now()}-${index}-${dynamicPath}.${extension}`,
          base64: value.base64,
        });
        return finalImage;
      }

      return value;
    }),
  );

  return data;
};

export default uploadMultipleImage;

