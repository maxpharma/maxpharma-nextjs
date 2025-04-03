import { Op } from "sequelize";
const buildListFilter = async (params: any) => {
  const offset = (params.page - 1) * params.limit;
  const filter: any = {
    limit: params.limit,
    offset: offset,
    order: [["createdAt", "DESC"]],
    where: {},
    attributes: {
      exclude: ["password"],
    },
  };
  if (params?.role) {
    filter.where = { ...filter?.role, role: params.role };
  }
  if (!!params?.search) {
    filter.where = {
      ...filter.where,
      [Op.or]: [
        { name: { [Op.like]: `%${params.search}%` } },
        { email: { [Op.like]: `%${params.search}%` } },
        { username: { [Op.like]: `%${params.search}%` } },
      ],
    };
  }

  return filter;
};

const buildFindFilter = async (params: any) => {
  const filter: any = {
    where: {},
    attributes: {},
  };
  if (!params?.includePassword) {
    filter.attributes.exclude = ["password"];
  }
  if (!!params?.id) {
    filter.where = { id: params.id };
  }

  if (params?.username) {
    filter.where = {
      [Op.or]: [{ email: params.username }, { username: params.username }],
    };
  }
  return filter;
};

export default {
  buildListFilter,
  buildFindFilter,
};