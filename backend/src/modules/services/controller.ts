import Service from "./service";
const controller = {
  get: async (req: Request) => {
    try {
      const { query }: any = req;
      const data = await Service.list({
        search: query?.search || null,
        categoryId: query?.categoryId || null,
      });
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
  find: async (req: Request) => {
    try {
      const { user, params }: any = req;
      const data = await Service.find({
        id: params?.id,
        categoryId: params?.categoryId,
      });
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
  create: async (req: Request) => {
    try {
      const data = await Service.create(req?.body);
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
  update: async (req: Request) => {
    try {
      const { params }: any = req;
      const data = await Service.update(req?.body, params?.id);
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
