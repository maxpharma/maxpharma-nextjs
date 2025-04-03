import Joi from 'joi'
import { Constant } from '../../utils'

const imageInputSchema = Joi.object({
  base64: Joi.string().required(),
  extension: Joi.string()
    .valid(...Constant.imageValidationExtensions, ...Constant.fileValidationExtensions)
    .required(),
}).optional()

const validationSchema = Joi.object({
  group: Joi.string().optional(),
  key: Joi.string().required(),
  value: Joi.string().required(),
  title: Joi.string().optional(),
  file: imageInputSchema,
})

export { validationSchema }