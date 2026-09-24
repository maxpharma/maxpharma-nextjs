import Model from "./model";
import Repository from "./repository";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ERROR_MESSAGES } from "../../utils/messages";
import {
  validationSchema,
  passwordValidationSchema,
  loginValidationSchema,
} from "./validationSchema";
import env from "../../config/env";
import { Helper } from "../../utils";
const list = async (params: any) => {
  try {
    const filter: any = await Repository.buildListFilter(params);
    const data = await Model.findAndCountAll(filter);
    return {
      items: data.rows,
      page: params.page,
      limit: params.limit,
      totalItems: data.count,
      totalPages: Math.ceil(data.count / params?.limit),
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

const create = async (input: any) => {
  try {
    const validate = await validationSchema.validateAsync(input);
    if (validate.error) {
      throw new Error(validate.error.details[0].message);
    }
    input.password = await Helper.hashPassword(input?.password);
    const data = await Model.create(input);
    data.setDataValue("role", "admin");
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const find = async (id: number) => {
  try {
    const filter: any = await Repository.buildFindFilter({
      id: id,
    });
    const data = await Model.findOne(filter);
    if (!!data) {
      data.setDataValue("role", "admin");
      return data;
    } else {
      throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

const changePassword = async (input: any, id: number) => {
  try {
    const validate = await passwordValidationSchema.validateAsync(input);
    if (validate?.error) {
      throw new Error(validate?.error?.details[0].message);
    }
    const data: any = await Model.findByPk(id);
    if (!data) {
      throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);
    }
    const isMatch = await bcrypt.compare(
      input?.currentPassword,
      data?.password,
    );

    if (!isMatch) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }
    await data.update({ password: await Helper.hashPassword(input?.newPassword) });
    data.setDataValue("role", "admin");
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const login = async (input: any) => {
  try {
    const validate = await loginValidationSchema.validateAsync(input);
    if (validate?.error) {
      throw new Error(validate?.error?.details[0].message);
    }
    const filter: any = await Repository.buildFindFilter({
      username: input?.username,
      includePassword: true,
    });
    const data: any = await Model.findOne(filter);
    if (!data) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    } else {
      const isMatch = await bcrypt.compare(input.password, data.password);

      if (!data?.isActive) {
        throw new Error("User is inactive");
      }
      if (!!isMatch) {
        const secret: string = env.JWT_SECRET || "";
        const token = await jwt.sign(
          { id: data.id, name: data.name, email: data.email, role: "admin" },
          secret,
          {
            expiresIn: "48h",
          },
        );
        if (!!input?.deviceToken) {
          if (!!data?.deviceToken && Array.isArray(data?.deviceToken)) {
            const findToken = data?.deviceToken.find(
              (token: string) => input?.deviceToken == token,
            );
            if (!findToken) {
              await data.update({
                deviceToken: [...data?.deviceToken, input?.deviceToken],
              });
            }
          } else {
            await data.update({
              deviceToken: [input?.deviceToken],
            });
          }
        }
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          username: data.username,
          isActive: data.isActive,
          role: "admin",
          token,
          deviceToken: data.deviceToken,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          deletedAt: data.deletedAt,
        };
      } else {
        throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

const logout = async (input: any, id: number) => {
  try {
    const data: any = await find(id);
    if (input?.deviceToken) {
      const filterToken: any = data?.deviceToken?.filter(
        (token: string) => token !== input?.deviceToken,
      );
      data.update({
        deviceToken: filterToken || [],
      });
    }
    return await find(id);
  } catch (err: any) {
    throw new Error(err);
  }
};

export default {
  list,
  create,
  find,
  changePassword,
  login,
  logout,
};