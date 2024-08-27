import { RequestHandler } from "express";
import StockRepository from "../repositories/StockRepository";

export const index: RequestHandler = async (request, response) => {
  const { orderBy } = request.query;
  const productStocks = await StockRepository.findAll(orderBy as string);
  return response.json(productStocks);
};

export const show: RequestHandler = async (request, response) => {
  const { id } = request.params;
  const stock = await StockRepository.findById(id);

  if (!stock) {
    return response.status(404).json({ error: "Item do estoque não encontrado" });
  }
  response.json(stock);
};

export const store: RequestHandler = async (request, response) => {
  const { productId, capacity, qtd } = request.body;

  if (!productId) {
    return response.status(400).json({ error: "O id do produto é obrigatório" });
  }

  const stockExists = await StockRepository.findByProductId(productId);
  if (stockExists) {
    return response
      .status(400)
      .json({ error: "O estoque desse produto ja existe" });
  }

  const stock = await StockRepository.create({
    productId,
    capacity,
    qtd,
  });
  response.json(stock);
};

export const update: RequestHandler = async (request, response) => {
  const { productId, capacity, qtd } = request.body;
  const { id } = request.params;
  const stockExists = await StockRepository.findById(id);

  if (!stockExists) {
    return response.status(404).json({ error: "Item do estoque não encontrado" });
  }

  if (!productId) {
    return response.status(400).json({ error: "O id do produto é obrigatório" });
  }

  const stock = await StockRepository.update(id, {
    productId,
    capacity,
    qtd,
  });
  response.json(stock);
};

export const deleteStock: RequestHandler = async (request, response) => {
  const { id } = request.params;

  await StockRepository.delete(id);
  response.sendStatus(204);
};
