import { RequestHandler } from "express";
import EmployeeRepository from "../repositories/EmployeeRepository";
import { z } from "zod";
import RoleRepository from "../repositories/RoleRepository";

export const index: RequestHandler = async (request, response) => {
  try {
    const { orderBy } = request.query;
    const employees = await EmployeeRepository.findAll(orderBy as string);
    response.json(employees);
  } catch {
    response.status(500).json({ error: "Erro interno, tente mais tarde" });
  }
};

export const show: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const employee = await EmployeeRepository.findById(id);
    if (!employee) {
      return response.status(404).json({ error: "Funcionário não encontrado" });
    }
    response.json(employee);
  } catch {
    response.status(500).json({ error: "Erro interno, tente mais tarde" });
  }
};

export const store: RequestHandler = async (request, response) => {
  try {
    const { name, email, phone, address, roleId, userName, password } =
      request.body;

    const addEmployeeSchema = z.object({
      name: z.string(),
      email: z.string().email({ message: "Email inválido" }),
      phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
        message: "Número de telefone inválido",
      }),
      address: z.string(),
      roleId: z.string(),
      userName: z.string(),
      password: z.string(),
    });

    const body = addEmployeeSchema.safeParse(request.body);

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const roleExists = await RoleRepository.findById(roleId);

    if (!roleExists) {
      return response.status(404).json({ error: "Cargo não encontrado" });
    }

    const newEmployee = await EmployeeRepository.create({
      name,
      email,
      phone,
      address,
      roleId,
      userName,
      password,
    });
    response.status(201).json(newEmployee);
  } catch {
    response.status(500).json({ error: "Erro interno, tente mais tarde" });
  }
};

export const update: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const { name, email, phone, address, roleId, userName, password } =
      request.body;

    const updateEmployeeSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string(),
      address: z.string(),
      roleId: z.string(),
      userName: z.string(),
      password: z.string(),
    });

    const body = updateEmployeeSchema.safeParse(request.body);

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const updatedEmployee = await EmployeeRepository.update(id, {
      name,
      email,
      phone,
      address,
      roleId,
      userName,
      password,
    });
    if (!updatedEmployee) {
      return response.status(404).json({ error: "Funcionário não encontrado" });
    }
    response.json(updatedEmployee);
  } catch {
    response.status(500).json({ error: "Erro interno, tente mais tarde" });
  }
};

export const deleteEmployee: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const deletedEmployee = await EmployeeRepository.delete(id);
    if (!deletedEmployee) {
      return response.status(404).json({ error: "Funcionário não encontrado" });
    }
    response.json({ message: "Funcionário deletado com sucesso" });
  } catch {
    response.status(500).json({ error: "Erro interno, tente mais tarde" });
  }
};
