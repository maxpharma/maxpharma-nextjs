import removeFile from "../../utils/removeFile";
import Portfolio from "./model"
import { ERROR_MESSAGES } from "../../utils/messages";
import { createValidationSchema} from "./validationSchema";
import Repository from "./repository";
const model = Portfolio

const list = async (params: any) => {
    try {
      const filter: any = await Repository.buildListFilter(params);
      const data: any = await model.findAndCountAll(filter);
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

const find = async (id: number) => {
    try {
      const filter: any = await Repository.buildFindFilter({
        id: id,
      });
      const data: any = await model.findOne(filter);
      if (!data) {
        return {};
      }
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
};

const create = async (input:any) => {
    try{
        const { error } = await createValidationSchema.validateAsync(input);
        if (!!error) {
          throw new Error(error.details[0].message);
        }
        const book = await model.create(input)
        return book
    }
    catch(err:any){
        throw new Error(err)
    }
}

const remove = async (id: number) => {
    try {
      const data: any = await find(id);
      if(!data){
        throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);
      }
      if (data.image) {
        await removeFile({ filePath: data.image });
      }
      await data.destroy();
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  }
  const count = async () => {
    try {
      const data: any = await model.count()
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  };

export default {
    create,
    list,
    find,        
    remove,
    count
}