import { RequestHandler } from "express";
import ContactsRepository from "../repositories/ContactsRepository";

export const index: RequestHandler = async (request, response) => {
  const { orderBy } = request.query;
  const contacts = await ContactsRepository.findAll(orderBy as string);
  return response.json(contacts);
};

export const show: RequestHandler = async (request, response) => {
  const { id } = request.params;
  const contact = await ContactsRepository.findById(id);

  if (!contact) {
    return response.status(404).json({ error: "Contact not found" });
  }
  response.json(contact);
};

export const store: RequestHandler = async (request, response) => {
  const { name, email, phone, categoryId } = request.body;

  if (!name) {
    return response.status(400).json({ error: "Name is required" });
  }
  const contactExists = await ContactsRepository.findByEmail(email);
  if (contactExists) {
    return response.status(400).json({ error: "This email is already in use" });
  }

  const contact = await ContactsRepository.create({
    name,
    email,
    phone,
    categoryId,
  });
  response.json(contact);
};

export const update: RequestHandler = async (request, response) => {
  const { name, email, phone, categoryId } = request.body;
  const { id } = request.params;
  const contactExists = await ContactsRepository.findById(id);

  if (!contactExists) {
    return response.status(404).json({ error: "Contact not found" });
  }

  if (!name) {
    return response.status(400).json({ error: "Name is required" });
  }

  if (!email) {
    return response.status(400).json({ error: "Email is required" });
  }

  const emailExists = await ContactsRepository.findByEmail(email);

  if (emailExists && emailExists.id !== id) {
    return response.status(400).json({ error: "This email is already in use" });
  }
  const contact = await ContactsRepository.update(id, {
    name,
    email,
    phone,
    categoryId,
  });
  response.json(contact);
};

export const deleteContact: RequestHandler = async (request, response) => {
  const { id } = request.params;

  await ContactsRepository.delete(id);
  response.sendStatus(204);
};
