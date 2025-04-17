import Joi from "joi";
import { Constant } from "../../utils";
export const imageInputSchema = Joi.object({
  base64: Joi.string().required(),
  extension: Joi.string()
    .valid(...Constant.imageValidationExtensions, ...Constant.fileValidationExtensions)
    .required(),
})
const validationSchema = Joi.object({
  footerText: Joi.string().required(),
  primaryColor: Joi.string().required(),
  secondaryColor: Joi.string().required(),
  primaryLightColor: Joi.string().required(),
}).when(Joi.ref("$method"), {
  switch: [
    {
      is: "POST",
      then: Joi.object({
        header: imageInputSchema.required(),
        footer: imageInputSchema.required(),
      }),
    },
    {
      is: "PATCH",
      then: Joi.object({
        header: imageInputSchema.optional(),
        footer: imageInputSchema.optional(),
      }),
    },
  ],
});

export { validationSchema };