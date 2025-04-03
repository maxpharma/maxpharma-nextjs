import Joi from "joi"
import { Constant } from "../../utils";
export const imageInputSchema = Joi.object({
    base64: Joi.string().required(),
    extension: Joi.string()
      .valid(...Constant.imageValidationExtensions, ...Constant.fileValidationExtensions)
      .required(),
  });
  
const createValidationSchema = Joi.object({
}).when(Joi.ref("$method"), {
    switch: [
      {
        is: "POST",
        then: Joi.object({
          image: imageInputSchema.required(),
          status: Joi.boolean().optional()
        }),
      },
      {
        is: "PATCH",
        then: Joi.object({
          image: imageInputSchema.optional(),
          status: Joi.boolean().required()
        }),
      },
    ],
  });

export {createValidationSchema}