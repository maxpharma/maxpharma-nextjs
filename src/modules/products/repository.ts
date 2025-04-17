import { Op } from "sequelize";
const buildListFilter = async (params: any) => {
  const filter: any = {
    order: [["createdAt", "DESC"]],
    where: {},
  };

  if (!!params?.search) {
    filter.where = {
      ...filter.where,
      name: { [Op.like]: `%${params.search}%` },
    };
  }

  if (!!params?.type){
    filter.where= {
        ...filter.where,
        type: params?.type,
    }
  }

  if (!!params?.categoryId){
    filter.where= {
        ...filter.where,
        categoryId: params?.categoryId,
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

  return filter;
};

export default { buildListFilter, buildFindFilter };