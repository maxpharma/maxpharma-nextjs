import Joi from "joi"
import { Constant } from "../../utils";
export const imageInputSchema = Joi.object({
  base64: Joi.string().required(),
  extension: Joi.string()
    .valid(...Constant.imageValidationExtensions, ...Constant.fileValidationExtensions)
    .required(),
})
  
const createValidationSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().length(10).required(),
  email: Joi.string().required(),
  location: Joi.string().required(),
  message: Joi.string().required(),
}).when(Joi.ref("$method"), {
  switch: [
    {
      is: "POST",
      then: Joi.object({
        file: imageInputSchema.required(),
      }),
    },
    {
      is: "PATCH",
      then: Joi.object({
        file: imageInputSchema.optional(),
      }),
    },
  ],
});

export {createValidationSchema}