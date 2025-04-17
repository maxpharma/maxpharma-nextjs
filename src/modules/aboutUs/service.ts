import AboutUs from "./model";
import Repository from "./repository";
import { createValidationSchema } from "./validationSchema";
import uploadImage from "../../utils/uploadImage";
import removeFile from "../../utils/removeFile";
import { ERROR_MESSAGES } from "../../utils/messages";
import uploadFile from "../../utils/uploadFile";
import uploadMultipleImage from "../../utils/uploadMultipleFile";
const model = AboutUs
const list = async (params: any) => {
  try {
    const filter: any = await Repository.buildListFilter(params);
    const data = await model.findAndCountAll(filter);
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
    const { error } = await createValidationSchema.validateAsync(input, {
      context: {
        method: "POST",
      },
    });
    if (!!error) {
      throw new Error(error.details[0].message);
    }
    if (!!input?.files) {
       input.files = await uploadMultipleImage(input.files, 'aboutUs')
    }
    const data = await model.create(input);
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
      input.file = await uploadMultipleImage(input?.files, 'aboutUs', data?.files)
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
    if (data.image) {
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