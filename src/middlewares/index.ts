import { Request, Response, NextFunction } from "express";
import { validationResult, body, param } from "express-validator";

// Middleware para remover propriedades desconhecidas
const sanitizeBody = (allowedFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Object.keys(req.body).forEach(key => {
      if (!allowedFields.includes(key)) {
        delete req.body[key];
      }
    });
    next();
  };
};

// Middleware para validar e sanitizar o corpo da requisição
const validateUser = [
  body('username').isString().notEmpty(),
  body('password').isString().notEmpty(),
  body('role').isString().notEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Middleware para validar o ID
const validateId = [
  param('id').isString().notEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export { sanitizeBody, validateUser, validateId };
