import Theme from "./model";
import Repository from "./repository";
import { validationSchema } from "./validationSchema";
import uploadImage from "../../utils/uploadImage";
import removeFile from "../../utils/removeFile";
import { ERROR_MESSAGES } from "../../utils/messages";
import uploadFile from "../../utils/uploadFile";
const model = Theme
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
    const { error } = await validationSchema.validateAsync(input, {
      context: {
        method: "POST",
      },
    });
    if (!!error) {
      throw new Error(error.details[0].message);
    }
    const uploadDocument = async (field:any, folder:any) => {
      if (!input?.[field]) return;
      const { extension, base64 } = input[field];
      const filePath = await uploadFile({
        filePath: folder,
        fileName: `${Date.now()}-${field}.${extension}`,
        base64,
      })
      input[field] = filePath;
    };
    
    await uploadDocument("header", "themes");
    await uploadDocument("footer", "themes");
    
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
    const { error } = await validationSchema.validateAsync(input, {
      context: {
        method: "PATCH",
      },
    });
    if (!!error) {
      throw new Error(error.details[0].message);
    }
    const data: any = await find(id);

    const uploadAndReplaceFile = async ( field: string, folder:string) => {
        if(!input?.[field]) return ;
        const {extension, base64} = input[field]
        const filePath = await uploadFile({
          filePath: folder,
          fileName: `${Date.now()}-${field}.${extension}`,
          base64,
         })

        if(!!data[field]){
          await removeFile({filePath: data[field]})
        }
        input[field] = filePath   
    }
    await uploadAndReplaceFile("header", "themes");
    await uploadAndReplaceFile("footer", "themes");

    const update = data.update(input)
    return update;

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
}
export default {
  list,
  create,
  find,
  update,
  remove,
  count
};