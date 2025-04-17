import Joi from "joi"

const createValidationSchema = Joi.object({
  name: Joi.string().required(),
  productId: Joi.number().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),
  subject: Joi.string().required(),
  message: Joi.string().required(),
})

export {createValidationSchema}