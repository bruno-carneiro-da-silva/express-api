import { RequestHandler } from "express";
import ProductRepository from "../repositories/ProductRepository";

export const index: RequestHandler = async (request, response) => {
  const { orderBy } = request.query;
  const products = await ProductRepository.findAll(orderBy as string);
  return response.json(products);
};

export const show: RequestHandler = async (request, response) => {
  const { id } = request.params;
  const product = await ProductRepository.findById(id);

  if (!product) {
    return response.status(404).json({ error: "Produto inexistente" });
  }
  response.json(product);
};

export const store: RequestHandler = async (request, response) => {
  const { name, qtd, price, categoryId } = request.body;

  if (!name || !qtd || !price || !categoryId) {
    return response
      .status(400)
      .json({ error: "Existem campos não preenchidos" });
  }
  const productExists = await ProductRepository.findByName(name);
  if (productExists) {
    return response.status(400).json({ error: "Esse produto já existe" });
  }

  const product = await ProductRepository.create({
    name,
    qtd,
    price,
    categoryId,
  });
  response.json(product);
};

export const update: RequestHandler = async (request, response) => {
  const { name, qtd, price, categoryId } = request.body;
  const { id } = request.params;
  const productExists = await ProductRepository.findById(id);

  if (!productExists) {
    return response.status(404).json({ error: "Produto não encontrado" });
  }

  if (!name) {
    return response.status(400).json({ error: "O nome é obrigatório" });
  }

  const productNameExists = await ProductRepository.findByName(name);
  const productIdExists = await ProductRepository.findById(id);

  if (productNameExists && productIdExists?.id !== id) {
    return response.status(400).json({ error: "Esse produto já está em uso" });
  }
  const product = await ProductRepository.update(id, {
    name,
    qtd,
    price,
    categoryId,
  });
  response.json(product);
};

export const deleteProduct: RequestHandler = async (request, response) => {
  const { id } = request.params;

  await ProductRepository.delete(id);
  response.sendStatus(204);
};
