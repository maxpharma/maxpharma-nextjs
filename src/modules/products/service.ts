import Model from "./model";
import Repository from "./repository";
import { createValidationSchema } from "./validationSchema";
import removeFile from "../../utils/removeFile";
import { ERROR_MESSAGES } from "../../utils/messages";
import uploadMultipleImage from "../../utils/uploadMultipleFile";
const list = async (params: any) => {
  try {
    const filter: any = await Repository.buildListFilter(params);
    const data = await Model.scope(["withCategory"]).findAndCountAll({
      ...filter,
      distinct: true,
      col: "products.id",
    });
    return {
      items: data.rows,
      page: params.page,
      limit: params.limit,
      totalItems: data.count || 0,
      totalPages: Math.ceil(data.count / params?.limit) || 0,
    };
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
      input.files = await uploadMultipleImage(input?.files, "products");
    }
    const data = await Model.create(input);
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
    const data: any = await find(id);
    if (!!input?.files) {
      input.files = await uploadMultipleImage(
        input?.files,
        "products",
        data?.files
      );
    }

    await data.update(input);
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
