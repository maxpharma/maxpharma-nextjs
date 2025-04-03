import type { IAuthRequest } from "../../routes";
import Service from "./service";
const controller = {
  get: async (req: IAuthRequest) => {
    try {
      const {query, user}: any = req
      const data = await Service.list({
        page: Number(query?.page) || 1,
        limit: Number(query?.limit) || 10,
        search: query?.search || null,
      });
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
  create: async (req: IAuthRequest) => {
    try {
      const { body }: any = req;
      const data = await Service.create(body);
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
  delete: async (req: Request) => {
    try {
      const { params }: any = req;
      const data = await Service.remove(params?.id);
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
};

export default controller;