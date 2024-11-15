import { RequestHandler } from "express";
import EmployeeRepository from "../repositories/EmployeeRepository";
import { z } from "zod";
import RoleRepository from "../repositories/RoleRepository";
import jwt from 'jsonwebtoken'

export const index: RequestHandler = async (request, response) => {
  try {
    const { orderBy, page = "1", filter = '' } = request.query;
    const per_page = 4

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).json({ error: "Token não fornecido" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const { employees, total } = await EmployeeRepository.findAll(
      orderBy as string, Number(page),
      per_page,
      filter as string,
      decoded.userId
    );

    response.json({ employees, total, per_page });
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

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).json({ error: "Token não fornecido" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

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
      companyId: decoded.userId,
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

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).json({ error: "Token não fornecido" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const updatedEmployee = await EmployeeRepository.update(id, {
      name,
      email,
      phone,
      address,
      roleId,
      userName,
      password,
      companyId: decoded.userId
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
