import Joi from "joi"
import { Constant } from "../../utils";

export const imageInputSchema = Joi.object({
    base64: Joi.string().required(),
    extension: Joi.string()
      .valid(...Constant.imageValidationExtensions, ...Constant.fileValidationExtensions)
      .required(),
});

const createValidationSchema = Joi.object({
  title: Joi.string().required(),
  file: imageInputSchema.required(),
  type: Joi.string().required(),
})

export {createValidationSchema}