import Joi from "joi"
import { Constant } from "../../utils";
export const imageInputSchema = Joi.object({
    base64: Joi.string().required(),
    extension: Joi.string()
      .valid(...Constant.imageValidationExtensions)
      .required(),
  });
  
const createValidationSchema = Joi.object({
  type: Joi.string().required(),
  galleryId: Joi.number().required(),
  file: Joi.string().required(),
})
// .when(Joi.ref("$method"), {
//     switch: [
//       {
//         is: "POST",
//         then: Joi.object({
//           file: imageInputSchema.required(),
//         }),
//       },
//       {
//         is: "PATCH",
//         then: Joi.object({
//           file: imageInputSchema.optional(),
//         }),
//       },
//     ],
//   });

const updateImage = Joi.object({
    id: Joi.number().required(),
    base64: Joi.string().base64().required(),
    extension: Joi.string()
     .valid(...Constant.imageValidationExtensions)
     .required(),
});


const updateValidationSchema = Joi.object({
    title: Joi.string().optional(),
    type: Joi.string().optional(),
    file: Joi.array().items(updateImage).optional()
})

export {createValidationSchema, updateValidationSchema}