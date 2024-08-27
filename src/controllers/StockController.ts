import { RequestHandler } from "express";
import StockRepository from "../repositories/StockRepository";
import { z } from "zod";
import ProductRepository from "../repositories/ProductRepository";

export const index: RequestHandler = async (request, response) => {
  try {
    const { orderBy } = request.query;
    const productStocks = await StockRepository.findAll(orderBy as string);
    return response.json(productStocks);
  } catch (error) {
    response.status(500).json({ error: "Erro ao buscar itens do estoque" });
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

    const stock = await StockRepository.findById(id);

    if (!stock) {
      return response
        .status(404)
        .json({ error: "Item do estoque não encontrado" });
    }
    response.json(stock);
  } catch (error) {
    response.status(500).json({ error: "Erro ao buscar item do estoque" });
  }
};

export const store: RequestHandler = async (request, response) => {
  try {
    const { productId, capacity, qtd } = request.body;
    const addStockSchema = z.object({
      productId: z.string(),
      capacity: z.number(),
      qtd: z.number(),
    });

    const body = addStockSchema.safeParse(request.body);

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }
    const productIdExists = await ProductRepository.findById(productId);
    const stockExists = await StockRepository.findByProductId(productId);

    if (!productIdExists) {
      return response.status(404).json({ error: "Produto não encontrado" });
    }

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
  } catch (error) {
    response.status(500).json({ error: "Erro ao criar item do estoque" });
  }
};

export const update: RequestHandler = async (request, response) => {
  try {
    const { productId, capacity, qtd } = request.body;
    const { id } = request.params;
    const updateStockIdSchema = z.string();
    const updateStockSchema = z.object({
      productId: z.string(),
      capacity: z.number(),
      qtd: z.number(),
    });
    const idSchema = updateStockIdSchema.safeParse(id);
    const body = updateStockSchema.safeParse(request.body);

    if (!idSchema.success) {
      return response.status(400).json({ error: "ID inválido" });
    }

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }
    const productIdExists = await ProductRepository.findById(productId);
    const stockExists = await StockRepository.findById(id);

    if (!productIdExists) {
      return response.status(404).json({ error: "Produto não encontrado" });
    }

    if (!stockExists) {
      return response
        .status(404)
        .json({ error: "Item do estoque não encontrado" });
    }

    const stock = await StockRepository.update(id, {
      productId,
      capacity,
      qtd,
    });
    response.json(stock);
  } catch (error) {
    response.status(500).json({ error: "Erro ao atualizar item do estoque" });
  }
};

export const deleteStock: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const deleteStockIdSchema = z.string();

    const body = deleteStockIdSchema.safeParse(id);

    if (!body.success) {
      return response.status(400).json({ error: "ID inválido" });
    }
    const stockExists = await StockRepository.findById(id);

    if (!stockExists) {
      return response
        .status(404)
        .json({ error: "Item do estoque não encontrado" });
    }

    await StockRepository.delete(id);
    response.sendStatus(204);
  } catch (error) {
    response.status(500).json({ error: "Erro ao deletar item do estoque" });
  }
};
