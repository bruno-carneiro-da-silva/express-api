import { RequestHandler } from "express";
import UsersRepository from "../repositories/UserRepository";

export const index: RequestHandler = async (request, response) => {
  const { orderBy } = request.query;
  const users = await UsersRepository.findAll(orderBy as string);
  return response.json(users);
};

export const show: RequestHandler = async (request, response) => {
  const { id } = request.params;
  const user = await UsersRepository.findById(id);

  if (!user) {
    return response.status(404).json({ error: "Usuário não encontrado" });
  }
  response.json(user);
};

export const store: RequestHandler = async (request, response) => {
  const { username, password, role } = request.body;

  if (!username) {
    return response.status(400).json({ error: "Username is required" });
  }

  if (!password) {
    return response.status(400).json({ error: "Senha é obrigatória" });
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
};

export const update: RequestHandler = async (request, response) => {
  const { username, password, role } = request.body;
  const { id } = request.params;
  const userExists = await UsersRepository.findById(id);

  if (!userExists) {
    return response.status(404).json({ error: "Usuário inexistente" });
  }

  if (!username) {
    return response
      .status(400)
      .json({ error: "Nome de usuário é obrigatório" });
  }

  if (!password) {
    return response.status(400).json({ error: "Senha é obrigatória" });
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
};

export const deleteUser: RequestHandler = async (request, response) => {
  const { id } = request.params;

  await UsersRepository.delete(id);
  response.sendStatus(204);
};
