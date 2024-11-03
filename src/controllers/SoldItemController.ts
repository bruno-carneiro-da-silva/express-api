import { RequestHandler } from "express";
import SoldItemRepository from "../repositories/SoldItemRepository";
import { z } from "zod";
import ProductRepository from "../repositories/ProductRepository";
import SalesRepository from "../repositories/SalesRepository";

export const index: RequestHandler = async (request, response) => {
  try {
    const { orderBy } = request.query;
    const soldItems = await SoldItemRepository.findAll(orderBy as string);
    return response.json(soldItems);
  } catch {
    response.status(500).json({ error: "Erro ao buscar itens vendidos" });
  }
};

export const show: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const showIdSchema = z.string();

    const body = showIdSchema.safeParse(id);
    if (!body.success) {
      return response.status(400).json({ error: "ID inválido" });
    }

    const soldItem = await SoldItemRepository.findById(id);

    if (!soldItem) {
      return response
        .status(404)
        .json({ error: "Item vendido não encontrado" });
    }
    response.json(soldItem);
  } catch {
    response.status(500).json({ error: "Erro ao buscar item vendido" });
  }
};

export const store: RequestHandler = async (request, response) => {
  try {
    const { saleId, productId, qtd, price } = request.body;

    const addSoldItemSchema = z.object({
      saleId: z.string(),
      productId: z.string(),
      qtd: z.number(),
      price: z.number(),
    });

    const body = addSoldItemSchema.safeParse(request.body);

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const productExists = await ProductRepository.findById(productId);
    const saleExists = await SalesRepository.findById(saleId);

    if (!productExists) {
      return response.status(404).json({ error: "Produto não encontrado" });
    }

    if (!saleExists) {
      return response.status(404).json({ error: "Venda não encontrada" });
    }

    const soldItem = await SoldItemRepository.create({
      saleId,
      productId,
      qtd,
      price,
    });
    response.status(201).json(soldItem);
  } catch {
    response.status(500).json({ error: "Erro ao criar item vendido" });
  }
};

export const update: RequestHandler = async (request, response) => {
  try {
    const { saleId, productId, qtd, price } = request.body;
    const { id } = request.params;
    const updateIdSchema = z.string();
    const updateSoldItemSchema = z.object({
      saleId: z.string(),
      productId: z.string(),
      qtd: z.number(),
      price: z.number(),
    });
    const idSchema = updateIdSchema.safeParse(id);
    const body = updateSoldItemSchema.safeParse(request.body);

    if (!idSchema.success) {
      return response.status(400).json({ error: "ID inválido" });
    }
    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }
    const productExists = await ProductRepository.findById(productId);
    const saleExists = await SalesRepository.findById(saleId);

    if (!productExists) {
      return response.status(404).json({ error: "Produto não encontrado" });
    }

    if (!saleExists) {
      return response.status(404).json({ error: "Venda não encontrada" });
    }

    const soldItemExists = await SoldItemRepository.findById(id);

    if (!soldItemExists) {
      return response
        .status(404)
        .json({ error: "Item vendido não encontrado" });
    }

    const soldItem = await SoldItemRepository.update(id, {
      saleId,
      productId,
      qtd,
      price,
    });
    response.json(soldItem);
  } catch {
    response.status(500).json({ error: "Erro ao atualizar item vendido" });
  }
};

export const deleteSoldItem: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const deleteIdSchema = z.string();
    const body = deleteIdSchema.safeParse(id);

    if (!body.success) {
      return response.status(400).json({ error: "ID inválido" });
    }
    const soldItemExists = await SoldItemRepository.findById(id);

    if (!soldItemExists) {
      return response
        .status(404)
        .json({ error: "Item vendido não encontrado" });
    }

    await SoldItemRepository.delete(id);
    response.sendStatus(204);
  } catch {
    response.status(500).json({ error: "Erro ao deletar item vendido" });
  }
};
