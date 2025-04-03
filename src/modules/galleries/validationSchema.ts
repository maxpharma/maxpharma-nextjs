import Joi from "joi"
import { Constant } from "../../utils";
export const imageInputSchema = Joi.object({
    id: Joi.number().optional(),
    base64: Joi.string().required(),
    extension: Joi.string()
      .valid(...Constant.imageValidationExtensions)
      .required(),
  });
  
const createValidationSchema = Joi.object({
  title: Joi.string().required(),
}).when(Joi.ref("$method"), {
  switch: [
    {
      is: "POST",
      then: Joi.object({
        file: Joi.array().items(imageInputSchema).min(1).required(),
      }),
    },
    {
      is: "PATCH",
      then: Joi.object({
        file: Joi.array().items(imageInputSchema).optional(),
      }),
    },
  ],
});

export {createValidationSchema}
