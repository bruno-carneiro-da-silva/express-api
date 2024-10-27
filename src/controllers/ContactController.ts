import { RequestHandler } from "express";
import ContactsRepository from "../repositories/ContactsRepository";
import { z } from "zod";
import errorMap from "zod/lib/locales/en";

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
    const idSchema = z.object({ id: z.string() });
    const body = idSchema.safeParse(request.params);

    if (!body.success) {
      return response.status(400).json({ error: "ID inválido" });
    }

    const id = body.data.id
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
    const { name, email, phone, address, companyId } = request.body;

    const addContactSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string(),
      address: z.string(),
      companyId: z.string(),
    });
    const body = addContactSchema.safeParse(request.body);

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
      address,
      companyId,
    });
    response.status(201).json(contact);
  } catch (error) {
    response.status(500).json({ error: "Erro ao criar contato" });
  }
};

export const update: RequestHandler = async (request, response) => {
  try {
    const { name, email, phone, address, companyId } = request.body;
    const idSchema = z.object({ id: z.string() });
    const updateContactSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string(),
      address: z.string(),
      companyId: z.string(),
    });
    const idBody = idSchema.safeParse(request.params);
    const body = updateContactSchema.safeParse(request.body);

    if (!idBody.success) {
      return response.status(400).json({ error: "ID inválido" });
    }
    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const id = idBody.data.id
    const contactExists = await ContactsRepository.findById(id);

    if (!contactExists) {
      return response.status(400).json({ error: "Contato não encontrado" });
    }

    const contact = await ContactsRepository.update(id, {
      name,
      email,
      phone,
      address,
      companyId,
    });
    response.json(contact);
  } catch (error) {
    response.status(500).json({ error: "Erro ao atualizar contato" });
  }
};

export const deleteContact: RequestHandler = async (request, response) => {
  try {
    const idSchema = z.object({ id: z.string() });

    const body = idSchema.safeParse(request.params);

    if (!body.success) {
      return response.status(400).json({ error: "ID inválido" });
    }

    const id = body.data.id

    await ContactsRepository.delete(id);
    response.sendStatus(204);
  } catch (error) {
    response.status(500).json({ error: "Erro ao deletar contato" });
  }
};
