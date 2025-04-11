import Joi from "joi"
import { Constant } from "../../utils";
export const imageInputSchema = Joi.alternatives().try(
  Joi.object({
    base64: Joi.string().required(),
    extension: Joi.string()
      .valid(...Constant.imageValidationExtensions, ...Constant.fileValidationExtensions)
      .required(),
  }),
  Joi.string().pattern(/^uploads\//)
);
  
const createValidationSchema = Joi.object({
  title: Joi.string().required(),
  files: Joi.array().items(imageInputSchema.allow("").allow(null)).optional()
})

export {createValidationSchema}
