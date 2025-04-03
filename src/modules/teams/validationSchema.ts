import Joi from "joi"
import { Constant } from "../../utils";
export const imageInputSchema = Joi.object({
    base64: Joi.string().required(),
    extension: Joi.string()
      .valid(...Constant.imageValidationExtensions, ...Constant.fileValidationExtensions)
      .required(),
  });
  
const createValidationSchema = Joi.object({
  type: Joi.string().required(),
  additionalInfo: Joi.object().required(),
}).when(Joi.ref("$method"), {
    switch: [
      {
        is: "POST",
        then: Joi.object({
          image: imageInputSchema.required(),
        }),
      },
      {
        is: "PATCH",
        then: Joi.object({
          image: imageInputSchema.optional(),
        }),
      },
    ],
  });

export {createValidationSchema}