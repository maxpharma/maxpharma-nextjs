import Joi from "joi";

const validationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().min(5).max(15).required(),
});

const passwordValidationSchema = Joi.object({
  currentPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string(),
});

const loginValidationSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(8).required(),
  deviceToken: Joi.string().optional(),
});

export { validationSchema, passwordValidationSchema, loginValidationSchema };