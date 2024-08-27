import { RequestHandler } from "express";
import CategoriesRepository from "../repositories/CategoriesRepository";
import { z } from "zod";

export const index: RequestHandler = async (request, response) => {
  try {
    const categories = await CategoriesRepository.findAll();
    response.json(categories);
  } catch (error) {
    response.status(500).json({ error: "Erro ao buscar categorias" });
  }
};

export const show: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const idSchema = z.string();

    const body = idSchema.safeParse(id);

    if (!body.success) {
      return response.status(400).json({ error: "ID inválido" });
    }

    const category = await CategoriesRepository.listOne(id);
    if (!category) {
      return response.status(404).json({ error: "Categoria não encontrada" });
    }
    response.json(category);
  } catch (error) {
    response.status(500).json({ error: "Erro ao buscar categoria" });
  }
};

export const store: RequestHandler = async (request, response) => {
  try {
    const { name } = request.body;
    const categorySchema = z.object({
      name: z.string(),
    });

    const body = categorySchema.safeParse(request.body);

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const category = await CategoriesRepository.create({ name });
    response.status(201).json(category);
  } catch (error) {
    response.status(500).json({ error: "Erro ao criar categoria" });
  }
};

export const update: RequestHandler = async (request, response) => {
  try {
    const { name } = request.body;
    const { id } = request.params;
    const idCategorySchema = z.string();
    const categorySchema = z.object({
      name: z.string(),
    });
    const idBody = idCategorySchema.safeParse(id);
    const body = categorySchema.safeParse(request.body);

    if (!idBody.success) {
      return response.status(400).json({ error: "ID inválido" });
    }
    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const categoryExists = await CategoriesRepository.listOne(id);

    if (!categoryExists) {
      return response.status(404).json({ error: "Categoria não encontrada" });
    }

    const category = await CategoriesRepository.update(id, { name });
    response.json(category);
  } catch (error) {
    response.status(500).json({ error: "Erro ao atualizar categoria" });
  }
};

export const deleteCategory: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const idSchema = z.string();

    const body = idSchema.safeParse(id);

    if (!body.success) {
      return response.status(400).json({ error: "ID inválido" });
    }

    await CategoriesRepository.delete(id);
    response.json({ message: "Categoria deletada" });
  } catch (error) {
    response.status(500).json({ error: "Erro ao deletar categoria" });
  }
};
