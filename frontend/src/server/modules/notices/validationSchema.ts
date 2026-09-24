import Joi from "joi"
import { Constant } from "../../utils";
export const imageInputSchema = Joi.object({
  base64: Joi.string().required(),
  extension: Joi.string()
    .valid(...Constant.imageValidationExtensions, ...Constant.fileValidationExtensions)
    .required(),
})
  
const createValidationSchema = Joi.object({
  documentType: Joi.string().required(),
  title: Joi.string().required(),
  date: Joi.string().required(),
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