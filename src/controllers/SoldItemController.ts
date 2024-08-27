import { RequestHandler } from "express";
import SoldItemRepository from "../repositories/SoldItemRepository";

export const index: RequestHandler = async (request, response) => {
  const { orderBy } = request.query;
  const soldItems = await SoldItemRepository.findAll(orderBy as string);
  return response.json(soldItems);
};

export const show: RequestHandler = async (request, response) => {
  const { id } = request.params;
  const soldItem = await SoldItemRepository.findById(id);

  if (!soldItem) {
    return response.status(404).json({ error: "Sold item not found" });
  }
  response.json(soldItem);
};

export const store: RequestHandler = async (request, response) => {
  const { saleId, productId, qtd, price } = request.body;

  if (!saleId || !productId || !qtd || !price) {
    return response.status(400).json({ error: "All fields are required" });
  }

  const soldItem = await SoldItemRepository.create({
    saleId,
    productId,
    qtd,
    price,
  });
  response.json(soldItem);
};

export const update: RequestHandler = async (request, response) => {
  const { saleId, productId, qtd, price } = request.body;
  const { id } = request.params;
  const soldItemExists = await SoldItemRepository.findById(id);

  if (!soldItemExists) {
    return response.status(404).json({ error: "Sold item not found" });
  }

  const soldItem = await SoldItemRepository.update(id, {
    saleId,
    productId,
    qtd,
    price,
  });
  response.json(soldItem);
};

export const deleteSoldItem: RequestHandler = async (request, response) => {
  const { id } = request.params;

  await SoldItemRepository.delete(id);
  response.sendStatus(204);
};
