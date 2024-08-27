import { RequestHandler } from "express";
import SalesRepository from "../repositories/SalesRepository";

export const index: RequestHandler = async (request, response) => {
  const { orderBy } = request.query;
  const sales = await SalesRepository.findAll(orderBy as string);
  return response.json(sales);
};

export const show: RequestHandler = async (request, response) => {
  const { id } = request.params;
  const sale = await SalesRepository.findById(id);

  if (!sale) {
    return response.status(404).json({ error: "Pedido não encontrado" });
  }
  response.json(sale);
};

export const store: RequestHandler = async (request, response) => {
  const { employeeId, userId, totalPrice, discount, soldItems } = request.body;

  if (
    !employeeId ||
    !userId ||
    !totalPrice ||
    !soldItems ||
    !Array.isArray(soldItems)
  ) {
    return response
      .status(400)
      .json({
        error: "Todos os campos são obrigatórios e soldItems deve ser um array",
      });
  }

  const sale = await SalesRepository.create({
    employeeId,
    userId,
    totalPrice,
    discount,
    soldItems,
  });
  response.json(sale);
};

export const update: RequestHandler = async (request, response) => {
  const { employeeId, userId, totalPrice, discount, soldItems } = request.body;
  const { id } = request.params;
  const saleExists = await SalesRepository.findById(id);

  if (!saleExists) {
    return response.status(404).json({ error: "Pedido não encontrado" });
  }

  const sale = await SalesRepository.update(id, {
    employeeId,
    userId,
    totalPrice,
    discount,
    soldItems,
  });
  response.json(sale);
};

export const deleteSale: RequestHandler = async (request, response) => {
  const { id } = request.params;

  await SalesRepository.delete(id);
  response.sendStatus(204);
};
