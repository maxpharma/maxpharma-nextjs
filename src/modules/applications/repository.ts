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
    };
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