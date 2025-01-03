import { RequestHandler } from "express";
import CompaniesRepository from "../repositories/CompanyRepository";
import { z } from "zod";
import SalesRepository from "../repositories/SalesRepository";
import jwt from 'jsonwebtoken'

export const index: RequestHandler = async (request, response) => {
  try {
    const { orderBy, page = "1", filter = "" } = request.query;
    const per_page = 5;

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).json({ error: "Token não fornecido" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const { sales, total } = await SalesRepository.findAll(
      orderBy as string,
      Number(page),
      per_page,
      filter as string,
      decoded.userId
    );

    const company = await CompaniesRepository.findByAccessToken(token);

    if (!company) {
      return response.status(404).json({ error: "Empresa não encontrada" });
    }

    const totalSales = await SalesRepository.findTotalSales();

    const { refreshToken, ...companyData } = company;

    return response.json({ companyData, sales, total, per_page, totalSales });
  } catch {
    response.status(500).json({ error: "Erro ao buscar empresa" });
  }
};

export const show: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const company = await CompaniesRepository.findById(id);

    if (!company) {
      return response.status(404).json({ error: "Usuário não encontrado" });
    }
    const { refreshToken, ...companyWithoutRefreshToken } = company;

    response.json(companyWithoutRefreshToken);
  } catch {
    response.status(500).json({ error: "Erro ao buscar usuário" });
  }
};

export const store: RequestHandler = async (request, response) => {
  try {
    const {
      firstName,
      lastName,
      emailAdmin,
      phoneNumberAdmin,
      nameCompany,
      emailCompany,
      phoneNumberCompany,
      addressCompany,
      password,
      roleId,
      photo,
    } = request.body;
    const addCompanySchema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      emailAdmin: z.string().email({ message: "Email inválido" }),
      phoneNumberAdmin: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
        message: "Número de telefone inválido",
      }),
      nameCompany: z.string(),
      emailCompany: z.string().email({ message: "Email inválido" }),
      phoneNumberCompany: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
        message: "Número de telefone inválido",
      }),
      addressCompany: z.string(),
      password: z.string(),
    });

    const body = addCompanySchema.safeParse(request.body);

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const companyExists = await CompaniesRepository.findByEmail(emailAdmin);
    const companyPhoneExists = await CompaniesRepository.findByPhoneNumber(
      phoneNumberAdmin
    );
    if (companyPhoneExists) {
      return response
        .status(400)
        .json({ error: "Esse número de telefone já está cadastrado" });
    }
    if (companyExists) {
      return response
        .status(400)
        .json({ error: "Esse email já está cadastrado" });
    }
    const defaultRoleId = 1;
    const company = await CompaniesRepository.create({
      firstName,
      lastName,
      emailAdmin,
      phoneNumberAdmin,
      nameCompany,
      emailCompany,
      phoneNumberCompany,
      addressCompany,
      password,
      roleId: roleId || defaultRoleId,
      photo,
    });

    response.json(company);
  } catch {
    response
      .status(500)
      .json({ error: "Erro ao criar usuário verifique as permissões" });
  }
};

export const update: RequestHandler = async (request, response) => {
  try {
    const { address, email, name, phoneNumber, photo } = request.body;
    const { id } = request.params;

    const updateCompanySchema = z.object({
      name: z.string(),
      email: z.string(),
      phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
        message: "Número de telefone inválido",
      }),
      address: z.string(),
      photo: z.string().optional(),
    });

    const body = updateCompanySchema.safeParse(request.body);

    if (!body.success) {
      console.log(body.error);
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const companyExists = await CompaniesRepository.findById(id);

    if (!companyExists) {
      return response.status(404).json({ error: "Usuário inexistente" });
    }

    const emailExists = await CompaniesRepository.findByEmail(email);

    if (emailExists && emailExists.id !== id) {
      return response.status(400).json({ error: "Esse usuário já existe" });
    }

    const company = await CompaniesRepository.update(id, {
      nameCompany: name,
      emailAdmin: email,
      phoneNumberAdmin: phoneNumber,
      addressCompany: address,
      photo,
    });

    const { password: _, ...userWithoutPassword } = company;
    response.json(userWithoutPassword);
  } catch {
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

    const companyExists = await CompaniesRepository.findById(id);

    if (!companyExists) {
      return response.status(404).json({ error: "Usuário não encontrado" });
    }
    await CompaniesRepository.delete(id);
    response.sendStatus(204);
  } catch {
    response.status(500).json({ error: "Erro ao deletar usuário" });
  }
};
