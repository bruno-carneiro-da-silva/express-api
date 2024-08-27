import { RequestHandler } from "express";

import CategoriesRepository from "../repositories/CategoriesRepository";

export const index: RequestHandler = async (request, response) => {
  const categories = await CategoriesRepository.findAll();
  response.json(categories);
};

export const show: RequestHandler = async (request, response) => {
  const { id } = request.params;
  const category = await CategoriesRepository.listOne(id);
  if (!category) {
    return response.status(404).json({ error: "Category not found" });
  }
  response.json(category);
};
export const store: RequestHandler = async (request, response) => {
  const { name } = request.body;
  if (!name) {
    return response.status(400).json({ error: "Name is required" });
  }
  const category = await CategoriesRepository.create({ name });
  response.json(category);
};

export const update: RequestHandler = async (request, response) => {
  const { name } = request.body;
  const { id } = request.params;
  const category = await CategoriesRepository.update(id, { name });
  response.json(category);
};
export const deleteCategory: RequestHandler = async (request, response) => {
  const { id } = request.params;
  await CategoriesRepository.delete(id);
  response.json({ message: "Category deleted" });
};
