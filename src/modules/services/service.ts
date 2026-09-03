import Model from "./model";
import Repository from "./repository";
import { createValidationSchema } from "./validationSchema";
import removeFile from "../../utils/removeFile";
import { ERROR_MESSAGES } from "../../utils/messages";
import uploadMultipleImage from "../../utils/uploadMultipleFile";
import cache from "../../utils/cache";

const list = async (params: any) => {
  try {
    const cacheKey = `services:${params?.page || 1}:${params?.limit || 10}:${params?.categoryId || ""}:${params?.search || ""}`;
    const cached = cache.get<any>(cacheKey);
    if (cached) return cached;

    const filter: any = await Repository.buildListFilter(params);
    const data = await Model.scope(["withCategory"]).findAndCountAll({
      ...filter,
      distinct: true,
      col: "services.id",
    });
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
    const { error } = await createValidationSchema.validateAsync(input);
    if (!!error) {
      throw new Error(error.details[0].message);
    }
    if (!!input?.files) {
      input.files = await uploadMultipleImage(input?.files, "services");
    }
    const data = await Model.create(input);
    cache.invalidatePrefix("services:");
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const find = async (params: any) => {
  try {
    const filter: any = await Repository.buildFindFilter(params);
    const data = await Model.scope(["withCategory"]).findOne(filter);
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
    const { error } = await createValidationSchema.validateAsync(input);
    if (!!error) {
      throw new Error(error.details[0].message);
    }
    const data: any = await find({
      id: id,
    });
    if (!!input?.files?.length) {
      input.files = await uploadMultipleImage(
        input?.files,
        "services",
        data?.files
      );
    }
    await data.update(input);
    cache.invalidatePrefix("services:");
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const remove = async (id: number) => {
  try {
    const data: any = await find({
      id: id,
    });
    if (data.image) {
      await removeFile({ filePath: data.image });
    }
    await data.destroy();
    cache.invalidatePrefix("services:");
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const count = async () => {
  try {
    const data: any = await Model.count();
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
  count,
};
