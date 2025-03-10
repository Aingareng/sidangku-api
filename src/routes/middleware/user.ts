import Joi from "joi";
import { RequestHandler } from "express";
import { IUserData } from "../../interface/user";

const createUserSchema = Joi.object<IUserData>({
  name: Joi.string().required().messages({
    "string.empty": "Username tidak boleh kosong",
    "any.required": "Username harus diisi",
  }),
  role_id: Joi.number().required().messages({
    "number.empty": "role_id tidak boleh kosong",
    "any.required": "role_id harus diisi",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email tidak valid",
    "string.empty": "Email tidak boleh kosong",
    "any.required": "Email harus diisi",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password minimal 6 karakter",
    "string.empty": "Password tidak boleh kosong",
    "any.required": "Password harus diisi",
  }),
  phone: Joi.string()
    .pattern(/^(?:\+62|62|0)8[1-9][0-9]{7,12}$/)
    .required()
    .messages({
      "string.empty": "Nomor telepon tidak boleh kosong",
      "any.required": "Nomor telepon harus diisi",
      "string.pattern.base":
        "Nomor telepon harus diawali dengan +62, 62, atau 08 dan memiliki 10-15 digit",
    }),
});

export const validateCreateUser: RequestHandler = (req, res, next) => {
  const { error } = createUserSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    res.status(400).json({
      status: 400,
      message: "Validasi gagal",
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }
  next();
};
