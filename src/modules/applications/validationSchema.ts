import Joi from "joi";
import { Constant } from "../../utils";
export const imageInputSchema = Joi.object({
  base64: Joi.string().required(),
  extension: Joi.string()
    .valid(...Constant.imageValidationExtensions, ...Constant.fileValidationExtensions)
    .required(),
})
const validationSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().length(10).required(),
}).when(Joi.ref("$method"), {
  switch: [
    {
      is: "POST",
      then: Joi.object({
        citizenship: imageInputSchema.required(),
        bankDeposit: imageInputSchema.required(),
        requestForm: imageInputSchema.required(),
      }),
    },
    {
      is: "PATCH",
      then: Joi.object({
        citizenship: imageInputSchema.optional(),
        bankDeposit: imageInputSchema.optional(),
        requestForm: imageInputSchema.optional(),
      }),
    },
  ],
});

export { validationSchema };