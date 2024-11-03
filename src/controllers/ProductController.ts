import { RequestHandler } from "express";
import ProductRepository from "../repositories/ProductRepository";
import StockRepository from "../repositories/StockRepository";
import { z } from "zod";
import CategoriesRepository from "../repositories/CategoriesRepository";

export const index: RequestHandler = async (request, response) => {
  try {
    const { orderBy } = request.query;
    const products = await ProductRepository.findAll(orderBy as string);
    return response.json(products);
  } catch {
    response.status(500).json({ error: "Erro interno, tente mais tarde" });
  }
};

export const show: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;

    const showProductSchema = z.string();

    const body = showProductSchema.safeParse(id);

    if (!body.success) {
      return response.status(400).json({ error: "ID inválido" });
    }

    const product = await ProductRepository.findById(id);

    if (!product) {
      return response.status(404).json({ error: "Produto inexistente" });
    }
    response.json(product);
  } catch {
    response.status(500).json({ error: "Erro ao buscar o produto" });
  }
};

export const store: RequestHandler = async (request, response) => {
  try {
    const {
      name,
      description,
      size,
      qtd,
      price,
      categoryId,
      photos,
      minStock,
      capacity,
    } = request.body;

    const addProductSchema = z.object({
      name: z.string(),
      description: z.string(),
      size: z.string(),
      qtd: z.number(),
      price: z.number(),
      categoryId: z.string(),
      photos: z.array(z.string()),
      minStock: z.number(),
      capacity: z.number(),
    });

    const body = addProductSchema.safeParse(request.body);

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Existem campos não preenchidos" });
    }

    const categoryExists = await CategoriesRepository.listOne(categoryId);

    const productExists = await ProductRepository.findByName(name);
    if (productExists) {
      return response.status(400).json({ error: "Esse produto já existe" });
    }

    if (!categoryExists) {
      return response.status(400).json({ error: "Essa categoria não existe" });
    }

    const product = await ProductRepository.create({
      name,
      description,
      size,
      qtd,
      price,
      categoryId,
      photos,
    });

    await StockRepository.create({
      productId: product.id,
      capacity,
      qtd,
      minStock,
    });

    response.json(product);
  } catch {
    response.status(500).json({ error: "Erro interno, tente mais tarde" });
  }
};

export const update: RequestHandler = async (request, response) => {
  try {
    const {
      name,
      qtd,
      description,
      size,
      photos,
      price,
      categoryId,
      capacity,
      minStock,
    } = request.body;
    const { id } = request.params;
    const validateIdSchema = z.object({
      id: z.string().uuid("ID inválido"),
    });
    const updateProductSchema = z.object({
      name: z.string(),
      qtd: z.number(),
      description: z.string(),
      size: z.string(),
      price: z.number(),
      photos: z.array(z.string()),
      categoryId: z.string(),
      minStock: z.number(),
      capacity: z.number(),
    });
    const idParsed = validateIdSchema.safeParse(request.params);
    const body = updateProductSchema.safeParse(request.body);

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Existem campos não preenchidos" });
    }
    if (!idParsed.success) {
      return response.status(400).json({ error: "ID inválido" });
    }

    const productNameExists = await ProductRepository.findByName(name);
    const productIdExists = await ProductRepository.findById(id);
    const categoryExists = await CategoriesRepository.listOne(categoryId);

    if (productNameExists && productIdExists?.id !== id) {
      return response
        .status(400)
        .json({ error: "Esse produto já está em uso" });
    }

    if (!categoryExists) {
      return response.status(400).json({ error: "Essa categoria não existe" });
    }

    const product = await ProductRepository.update(id, {
      name,
      qtd,
      price,
      description,
      size,
      photos,
      categoryId,
      minStock,
    });

    const stockExists = await StockRepository.findByProductId(id);
    if (stockExists) {
      await StockRepository.update(stockExists.id, {
        capacity,
        qtd,
        minStock,
      });
    } else {
      await StockRepository.create({
        productId: product.id,
        capacity,
        qtd,
        minStock,
      });
    }

    response.json(product);
  } catch {
    response.status(500).json({ error: "Erro interno, tente mais tarde" });
  }
};

export const deleteProduct: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;

    const validateIdSchema = z.object({
      id: z.string().uuid("ID inválido"),
    });

    const body = validateIdSchema.safeParse(request.params);

    if (!body.success) {
      return response.status(400).json({ error: "ID inválido" });
    }
    const productExists = await ProductRepository.findById(id);

    if (!productExists) {
      return response.status(404).json({ error: "Produto não encontrado" });
    }

    const stockExists = await StockRepository.findByProductId(id);
    if (stockExists) {
      await StockRepository.delete(stockExists.id);
    }

    await ProductRepository.delete(id);
    response.sendStatus(204);
  } catch {
    response.status(500).json({ error: "Erro interno, tente mais tarde" });
  }
};
