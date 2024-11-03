import { RequestHandler } from "express";
import { z } from "zod";
import RoleRepository from "../repositories/RoleRepository";

export const index: RequestHandler = async (request, response) => {
  try {
    const { orderBy } = request.query;
    const roles = await RoleRepository.findAll(orderBy as string);
    response.json(roles);
  } catch {
    response.status(500).json({ error: "Erro interno, tente mais tarde" });
  }
};

export const show: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const role = await RoleRepository.findById(id);
    if (!role) {
      return response.status(404).json({ error: "Cargo não encontrado" });
    }
    response.json(role);
  } catch {
    response.status(500).json({ error: "Erro interno, tente mais tarde" });
  }
};

export const store: RequestHandler = async (request, response) => {
  try {
    const { name, permissions } = request.body;

    const addRoleSchema = z.object({
      name: z.string(),
      permissions: z.array(z.string()),
    });

    const body = addRoleSchema.safeParse(request.body);

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const roleExists = await RoleRepository.findByName(name);

    if (roleExists) {
      return response
        .status(404)
        .json({ error: "Cargo ja existe, tente outro nome" });
    }

    const newEmployee = await RoleRepository.create({
      name,
      permissions,
    });
    response.status(201).json(newEmployee);
  } catch {
    response.status(500).json({ error: "Erro interno, tente mais tarde" });
  }
};

export const update: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const { name, permissions } = request.body;

    const updateRoleSchema = z.object({
      name: z.string(),
      permissions: z.array(z.string()),
    });

    const body = updateRoleSchema.safeParse(request.body);

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const roleExists = await RoleRepository.findById(id);

    if (!roleExists) {
      return response.status(404).json({ error: "Id do cardo é inválido" });
    }

    const updatedRole = await RoleRepository.update(id, {
      name,
      permissions,
    });

    if (!updatedRole) {
      return response.status(404).json({ error: "Cargo não encontrado" });
    }
    response.json(updatedRole);
  } catch {
    response.status(500).json({ error: "Erro interno, tente mais tarde" });
  }
};

export const deleteRole: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;

    const roleExists = await RoleRepository.findById(id);

    if (!roleExists) {
      return response.status(404).json({ error: "Cargo não encontrado" });
    }

    await RoleRepository.delete(id);

    response.json({ message: "Funcionário deletado com sucesso" });
  } catch {
    response.status(500).json({ error: "Erro interno, tente mais tarde" });
  }
};
