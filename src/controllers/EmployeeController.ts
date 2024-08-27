import { RequestHandler } from "express";
import EmployeeRepository from "../repositories/EmployeeRepository";
import { z } from "zod";
export const index: RequestHandler = async (request, response) => {
  try {
    const { orderBy } = request.query;
    const employees = await EmployeeRepository.findAll(orderBy as string);
    response.json(employees);
  } catch (error) {
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
  } catch (error) {
    response.status(500).json({ error: "Erro interno, tente mais tarde" });
  }
};

export const store: RequestHandler = async (request, response) => {
  try {
    const { name, email, phone, address, role, login, senha } = request.body;

    const addEmployeeSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string(),
      address: z.string(),
      role: z.string(),
      login: z.string(),
      senha: z.string(),
    });

    const body = addEmployeeSchema.safeParse(request.body);

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const newEmployee = await EmployeeRepository.create({
      name,
      email,
      phone,
      address,
      role,
      login,
      senha,
    });
    response.status(201).json(newEmployee);
  } catch (error) {
    response.status(500).json({ error: "Erro interno, tente mais tarde" });
  }
};

export const update: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const { name, email, phone, address, role, login, senha } = request.body;

    const updateEmployeeSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string(),
      address: z.string(),
      role: z.string(),
      login: z.string(),
      senha: z.string(),
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
      role,
      login,
      senha,
    });
    if (!updatedEmployee) {
      return response.status(404).json({ error: "Funcionário não encontrado" });
    }
    response.json(updatedEmployee);
  } catch (error) {
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
  } catch (error) {
    response.status(500).json({ error: "Erro interno, tente mais tarde" });
  }
};
