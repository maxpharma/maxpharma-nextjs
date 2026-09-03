import Notice from "./model";
import Repository from "./repository";
import { createValidationSchema } from "./validationSchema";
import uploadImage from "../../utils/uploadImage";
import removeFile from "../../utils/removeFile";
import { ERROR_MESSAGES } from "../../utils/messages";
import uploadFile from "../../utils/uploadFile";
import uploadMultipleImage from "../../utils/uploadMultipleFile";
import { Constant } from "../../utils";
import cache from "../../utils/cache";
const model = Notice
const list = async (params: any) => {
  try {
    const cacheKey = `notices:${params?.page || 1}:${params?.limit || 10}:${params?.search || ""}`;
    const cached = cache.get<any>(cacheKey);
    if (cached) return cached;

    const filter: any = await Repository.buildListFilter(params);
    const data = await model.findAndCountAll(filter);
    const result = {
      items: data.rows,
      page: params.page,
      limit: params.limit,
      totalItems: data.count || 0,
      totalPages: Math.ceil(data.count / params?.limit) || 0,
    };
    cache.set(cacheKey, result, 60);
    return result;
  } catch (err: any) {
    throw new Error(err);
  }
};

const create = async (input: any) => {
  try {
    const { error } = await createValidationSchema.validateAsync(input, {
      context: {
        method: "POST",
      },
    });
    if (!!error) {
      throw new Error(error.details[0].message);
    }
    if (!!input?.file) {
      if(Constant.imageValidationExtensions.includes(input?.file.extension)){
        const { file } = input;
        input.file = await uploadFile({
          filePath: `notices`,
          fileName: `${Date.now()}-notice.${file.extension}`,
          base64: file.base64,
        });
      } else if (Constant.fileValidationExtensions.includes(input?.file.extension)){
        const { file } = input;
        input.file = await uploadFile({
          filePath: `notices`,
          fileName: `${Date.now()}-notice.${file.extension}`,
          base64: file.base64,
        });
      }
    }
    const data = await model.create(input);
    cache.invalidatePrefix("notices:");
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const find = async (id: any) => {
  try {
    const filter: any = await Repository.buildFindFilter({
      id: id,
    });
    const data = await model.findOne(filter);
    if (!data) {
      throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);
    }
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const update = async (input: any, id: number) => {
  try {
    const { error } = await createValidationSchema.validateAsync(input, {
      context: {
        method: "PATCH",
      },
    });
    if (!!error) {
      throw new Error(error.details[0].message);
    }
    const data: any = await find(id);
    if (!!input?.file) {
      if (typeof input.file === "string") {
        // Keep existing file
        input.file = input.file.replace(/^\/+/, "");
      } else if (input.file?.base64) {
        const { file } = input;
        const newFilePath = await uploadFile({
          filePath: `notices`,
          fileName: `${Date.now()}-notice.${file.extension || "pdf"}`,
          base64: file.base64,
        });
        if (data.file && data.file !== newFilePath) {
          await removeFile({ filePath: data.file });
        }
        input.file = newFilePath;
      }
    }
    await data.update(input);
    cache.invalidatePrefix("notices:");
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const remove = async (id: number) => {
  try {
    const data: any = await find(id);
    if (!!data.files) {
      await removeFile({ filePath: data.image });
    }
    await data.destroy();
    cache.invalidatePrefix("notices:");
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};
const count = async () => {
  try {
    const data: any = await model.count()
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};
export default {
  list,
  create,
  find,
  update,
  remove,
  count
};