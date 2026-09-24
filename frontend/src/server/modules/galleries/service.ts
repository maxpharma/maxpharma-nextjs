import Application from "./model";
import Repository from "./repository";
import { createValidationSchema } from "./validationSchema";
import uploadImage from "../../utils/uploadImage";
import removeFile from "../../utils/removeFile";
import { ERROR_MESSAGES } from "../../utils/messages";
import uploadFile from "../../utils/uploadFile";
import { Constant } from "../../utils";
import uploadMultipleImage from "../../utils/uploadMultipleFile";
import cache from "../../utils/cache";
const model = Application
const list = async (params: any) => {
  try {
    const cacheKey = `galleries:${params?.page || 1}:${params?.limit || 10}:${params?.search || ""}`;
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
    if(!!input.files){
      console.log('inside image')
      input.files = await uploadMultipleImage(input?.files, 'galleries')
    }
    const data = await model.create(input);
    cache.invalidatePrefix("galleries:");
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const find = async (params: any) => {
  try {
    const filter: any = await Repository.buildFindFilter(params);
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
    const data: any = await find({
      id:id
    });
    if(!!input?.files){
      input.files = await uploadMultipleImage(input?.files, 'galleries', data?.files)
    }
    await data.update(input);
    cache.invalidatePrefix("galleries:");
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const remove = async (id: number) => {
  try {
    const data: any = await find({
      id: id
    });
    if (!!data?.files) {
      for (const item of data.files) {
        await removeFile({ filePath: item });
      }
    }
    await data.destroy();
    cache.invalidatePrefix("galleries:");
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