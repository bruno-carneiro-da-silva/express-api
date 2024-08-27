import { RequestHandler } from "express";

export const requestInterceptor: RequestHandler = (req, res, next) => {
  const { method, originalUrl, body } = req;
  console.log(`- [${method}] ${originalUrl} ${JSON.stringify(body)}`);
  next();
};
