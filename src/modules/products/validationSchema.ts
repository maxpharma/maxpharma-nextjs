import Joi from "joi"
import { Constant } from "../../utils";
export const imageInputSchema = Joi.alternatives().try(
  Joi.object({
    base64: Joi.string().required(),
    extension: Joi.string()
      .valid(...Constant.imageValidationExtensions, ...Constant.fileValidationExtensions)
      .required(),
  }),
  Joi.string().pattern(/^(uploads\/|maxpharma\/|http:\/\/|https:\/\/)/)
);
  
const createValidationSchema = Joi.object({
  type: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  categoryId: Joi.number().required(),
  additionalInfo: Joi.object().required(),
  files: Joi.array().items(imageInputSchema.allow("").allow(null)).optional()
})

export {createValidationSchema}