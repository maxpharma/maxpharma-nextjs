import { Op } from "sequelize";
const buildListFilter = async (params: any) => {
  const filter: any = {
    order: [["createdAt", "DESC"]],
    where: {},
  };

  const limit = Math.min(Math.max(Number(params?.limit) || 10, 1), 100);
  const page = Math.max(Number(params?.page) || 1, 1);
  filter.limit = limit;
  filter.offset = (page - 1) * limit;

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