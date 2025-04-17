import { Op } from "sequelize";

const buildListFilter = async (params: any) => {
    const filter: any = {
      order: [["createdAt", "DESC"]],
      where: {},
    };
    if (!!params?.page) {
      const offset = (params.page - 1) * params.limit;
      filter.limit = params.limit;
      filter.offset = offset;
    }
  
    if (!!params?.search) {
      filter.where = {
        ...filter.where,
        name: { [Op.like]: `%${params.search}%` },
        author: { [Op.like]: `%${params.search}%` },
        category: { [Op.like]: `%${params.search}%` },
      };
    }

    if(params?.type){
        filter.where = {
            ...filter.where,
            type: params?.type
      }
    }
  
    return filter;
  };
  const buildFindFilter = async (params: any) => {
    const filter: any = {
      where: {},
    };
  
    if (!!params?.id) {
      filter.where = { id: params.id };
    }
    if(params?.status){
      filter.where = {...filter.where, status: params.status };
    }
    return filter;
  };

  export default {
    buildListFilter,
    buildFindFilter
  }