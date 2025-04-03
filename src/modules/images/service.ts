import Image from "./model";
import Repository from "./repository";
import { createValidationSchema, updateValidationSchema } from "./validationSchema";
import uploadImage from "../../utils/uploadImage";
import removeFile from "../../utils/removeFile";
import { ERROR_MESSAGES } from "../../utils/messages";
const model = Image
const list = async (params: any) => {
  try {
    const filter: any = await Repository.buildListFilter(params);
    const data = await model.findAll(filter);
    return data;
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

const update = async (input: any) => {
  try {
    const { error } = await updateValidationSchema.validateAsync(input, {
      context: {
        method: "PATCH",
      },
    });
    if (!!error) {
      throw new Error(error.details[0].message);
    }
    if (input?.file) {
        const uploadAllImages =  input?.file?.map(async(file:any,i:any) => {
            const data: any = await find(file?.id);
            const filePath = await uploadImage({
              filePath: `galleries`,
              fileName: `${Date.now()}-${i}-gallery.${file.extension}`,
              base64: file.base64,
            });
            if (data?.file) {
                await removeFile({ filePath: data.file });
            }
            await data.update({ file: filePath });
        })
        await Promise.all(uploadAllImages)
    }
    return input
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