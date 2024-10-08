import { RequestHandler } from "express";
import ContactsRepository from "../repositories/ContactsRepository";
import { z } from "zod";
import CategoriesRepository from "../repositories/CategoriesRepository";

export const index: RequestHandler = async (request, response) => {
  try {
    const { orderBy } = request.query;
    const contacts = await ContactsRepository.findAll(orderBy as string);
    response.json(contacts);
  } catch (error) {
    response.status(500).json({ error: "Erro ao buscar contatos" });
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

    const contact = await ContactsRepository.findById(id);
    if (!contact) {
      return response.status(404).json({ error: "Contato não encontrado" });
    }
    response.json(contact);
  } catch (error) {
    response.status(500).json({ error: "Erro ao buscar contato" });
  }
};

export const store: RequestHandler = async (request, response) => {
  try {
    const { name, email, phone, categoryId } = request.body;

    const addContactSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string(),
      categoryId: z.string(),
    });
    const categoryExists = await CategoriesRepository.listOne(categoryId);
    const body = addContactSchema.safeParse(request.body);

    if (!categoryExists) {
      return response.status(404).json({ error: "Categoria não encontrada" });
    }

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const contactExists = await ContactsRepository.findByEmail(email);
    if (contactExists) {
      return response.status(400).json({ error: "Este email já está em uso" });
    }

    const contact = await ContactsRepository.create({
      name,
      email,
      phone,
      categoryId,
    });
    response.status(201).json(contact);
  } catch (error) {
    response.status(500).json({ error: "Erro ao criar contato" });
  }
};

export const update: RequestHandler = async (request, response) => {
  try {
    const { name, email, phone, categoryId } = request.body;
    const { id } = request.params;
    const idSchema = z.string();
    const updateContactSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string(),
      categoryId: z.string(),
    });
    const idBody = idSchema.safeParse(id);
    const body = updateContactSchema.safeParse(request.body);

    if (!idBody.success) {
      return response.status(400).json({ error: "ID inválido" });
    }
    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }
    const categoryExists = await CategoriesRepository.listOne(categoryId);
    const contactExists = await ContactsRepository.findById(id);

    if (!categoryExists) {
      return response.status(404).json({ error: "Categoria não encontrada" });
    }

    if (!contactExists) {
      return response.status(404).json({ error: "Contato não encontrado" });
    }

    const contact = await ContactsRepository.update(id, {
      name,
      email,
      phone,
      categoryId,
    });
    response.json(contact);
  } catch (error) {
    response.status(500).json({ error: "Erro ao atualizar contato" });
  }
};

export const deleteContact: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const idSchema = z.string();

    const body = idSchema.safeParse(request.params);

    if (!body.success) {
      return response.status(400).json({ error: "ID inválido" });
    }
    await ContactsRepository.delete(id);
    response.sendStatus(204);
  } catch (error) {
    response.status(500).json({ error: "Erro ao deletar contato" });
  }
};
