import Service from "./service";

const controller = {
  get: async (req: Request | any) => {
    try {
      const { query }: any = req;
      const data = await Service.list({
        page: Number(query?.page) || 1,
        limit: Number(query?.limit) || 10,
      });
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
  register: async (req: Request) => {
    try {
      const data = await Service.create(req?.body as any);
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
  find: async (req: Request | any) => {
    try {
      const { user }: any = req;
      const data = await Service.find(user?.id);
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
  changePassword: async (req: Request | any) => {
    try {
      const { user }: any = req;
      const data = await Service.changePassword(req?.body as any, user?.id);
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
  login: async (req: Request) => {
    try {
      const data = await Service.login(req?.body as any);
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
  logout: async (req: Request | any) => {
    try {
      const data = await Service.logout(req?.body, req.user.id);
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
};

export default controller;