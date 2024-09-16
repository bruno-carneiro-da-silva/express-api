import { Request, Response, NextFunction } from "express";
import { validationResult, body, param } from "express-validator";

const sanitizeBody = (allowedFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Object.keys(req.body).forEach((key) => {
      if (!allowedFields.includes(key)) {
        delete req.body[key];
      }
    });
    next();
  };
};

const validateUser = [
  body("username").isString().notEmpty(),
  body("firstName").isString().notEmpty(),
  body("lastName").isString().notEmpty(),
  body("emailAdmin").isEmail().notEmpty(),
  body("phoneNumberAdmin").isString().notEmpty(),
  body("password").isString().notEmpty(),
  body("nameCompany").isString().notEmpty(),
  body("emailCompany").isEmail().notEmpty(),
  body("phoneNumberCompany").isString().notEmpty(),
  body("addressCompany").isString().notEmpty(),
  body("terms").isBoolean(),
  body("role").isString().notEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateId = [
  param("id").isString().notEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export { sanitizeBody, validateUser, validateId };
