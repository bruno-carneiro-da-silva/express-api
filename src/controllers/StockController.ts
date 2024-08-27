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
    return response.status(404).json({ error: "Stock not found" });
  }
  response.json(stock);
};

export const store: RequestHandler = async (request, response) => {
  const { productId, capacity, qtd } = request.body;

  if (!productId) {
    return response.status(400).json({ error: "Product ID is required" });
  }

  const stockExists = await StockRepository.findByProductId(productId);
  if (stockExists) {
    return response
      .status(400)
      .json({ error: "Stock for this product already exists" });
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
    return response.status(404).json({ error: "Stock not found" });
  }

  if (!productId) {
    return response.status(400).json({ error: "Product ID is required" });
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
