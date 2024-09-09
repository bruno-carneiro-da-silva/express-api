import { RequestHandler } from "express";
import UsersRepository from "../repositories/UserRepository";
import { z } from "zod";

export const index: RequestHandler = async (request, response) => {
  try {
    const { orderBy } = request.query;
    const users = await UsersRepository.findAll(orderBy as string);
    return response.json(users);
  } catch (error) {
    response.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

export const show: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const user = await UsersRepository.findById(id);

    if (!user) {
      return response.status(404).json({ error: "Usuário não encontrado" });
    }
    response.json(user);
  } catch (error) {
    response.status(500).json({ error: "Erro ao buscar usuário" });
  }
};

export const store: RequestHandler = async (request, response) => {
  try {
    const { username, password, role } = request.body;
    const addUserSchema = z.object({
      username: z.string(),
      password: z.string(),
      role: z.string(),
    });

    const body = addUserSchema.safeParse(request.body);

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const userExists = await UsersRepository.findByUsername(username);
    if (userExists) {
      return response.status(400).json({ error: "Esse usuário já existe" });
    }

    const user = await UsersRepository.create({
      username,
      password,
      role,
    });
    response.json(user);
  } catch (error) {
    response.status(500).json({ error: "Erro ao criar usuário" });
  }
};

export const update: RequestHandler = async (request, response) => {
  try {
    const { username, password, role } = request.body;
    const { id } = request.params;

    const updateUserSchema = z.object({
      username: z.string(),
      password: z.string(),
      role: z.string(),
    });

    const body = updateUserSchema.safeParse(request.body);

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const userExists = await UsersRepository.findById(id);

    if (!userExists) {
      return response.status(404).json({ error: "Usuário inexistente" });
    }

    const usernameExists = await UsersRepository.findByUsername(username);

    if (usernameExists && usernameExists.id !== id) {
      return response.status(400).json({ error: "Esse usuário já existe" });
    }
    const user = await UsersRepository.update(id, {
      username,
      password,
      role,
    });
    response.json(user);
  } catch (error) {
    response.status(500).json({ error: "Erro ao atualizar usuário" });
  }
};

export const deleteUser: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;

    const idSchema = z.string();

    const body = idSchema.safeParse(id);

    if (!body.success) {
      return response.status(400).json({ error: "ID inválido" });
    }

    const userExists = await UsersRepository.findById(id);

    if (!userExists) {
      return response.status(404).json({ error: "Usuário não encontrado" });
    }
    await UsersRepository.delete(id);
    response.sendStatus(204);
  } catch (error) {
    response.status(500).json({ error: "Erro ao deletar usuário" });
  }
};
