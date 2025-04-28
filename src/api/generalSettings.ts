import request from "@/utils/request";
import { ReturnType } from "./types";

const getByGroup = async (state: string, group: string, type?: string) => {
  try {
    const config: ReturnType = {
      url: `generalSettings/group/${group}?type=${type}`,
      method: "get",
      authorization: false,
      config: {
        showErr: true,
        store: {
          action: "set",
          key: state,
        },
      },
    };
    const response = await request(config);
    return response;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

const getByKey = async (state: string, key: string) => {
  try {
    const config: ReturnType = {
      url: `generalSettings/key/${key}`,
      method: "get",
      authorization: false,
      config: {
        showErr: true,
        store: {
          action: "set",
          key: state,
        },
      },
    };
    const response = await request(config);
    return response;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

const create = async (state: string, data: any) => {
  try {
    const config: ReturnType = {
      url: `generalSettings`,
      method: "post",
      data,
      authorization: true,
      config: {
        showErr: true,
        successMsg: "Data Created Successfully",
        store: {
          action: "set",
          key: state,
        },
      },
    };
    const response = await request(config);
    return response;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

const update = async (state: string, data: any, id: number) => {
  try {
    const config: ReturnType = {
      url: `generalSettings/${id}`,
      method: "patch",
      data,
      authorization: true,
      config: {
        showErr: true,
        successMsg: "Updated Successfully",
        store: {
          action: "update",
          key: state,
        },
      },
    };
    const response = await request(config);
    return response;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

const remove = async (state: string, id: any) => {
  try {
    const config: ReturnType = {
      url: `generalSettings/${id}`,
      method: "delete",
      authorization: true,
      config: {
        showErr: true,
        successMsg: "Deleted Successfully",
        store: {
          action: "reset",
          key: state,
        },
      },
    };
    const response = await request(config);
    return response;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

const GeneralSettings = {
  getByKey,
  getByGroup,
  create,
  update,
  remove,
};

export default GeneralSettings;
