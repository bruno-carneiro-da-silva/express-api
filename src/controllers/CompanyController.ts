import { RequestHandler } from "express";
import CompaniesRepository from "../repositories/CompanyRepository";
import { z } from "zod";

export const index: RequestHandler = async (request, response) => {
  try {
    const { orderBy } = request.query;
    const users = await CompaniesRepository.findAll(orderBy as string);
    return response.json(users);
  } catch (error) {
    response.status(500).json({ error: "Erro ao buscar usuários" });
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
  } catch (error) {
    console.log(error);
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
    });

    response.json(company);
  } catch (error) {
    response.status(500).json({ error: error });
  }
};

export const update: RequestHandler = async (request, response) => {
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
    } = request.body;
    const { id } = request.params;

    const updateCompanySchema = z.object({
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

    const body = updateCompanySchema.safeParse(request.body);

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const companyExists = await CompaniesRepository.findById(id);

    if (!companyExists) {
      return response.status(404).json({ error: "Usuário inexistente" });
    }

    const emailExists = await CompaniesRepository.findByEmail(emailAdmin);

    if (emailExists && emailExists.id !== id) {
      return response.status(400).json({ error: "Esse usuário já existe" });
    }

    const company = await CompaniesRepository.update(id, {
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
    });

    const { password: _, ...userWithoutPassword } = company;
    response.json(userWithoutPassword);
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

    const companyExists = await CompaniesRepository.findById(id);

    if (!companyExists) {
      return response.status(404).json({ error: "Usuário não encontrado" });
    }
    await CompaniesRepository.delete(id);
    response.sendStatus(204);
  } catch (error) {
    response.status(500).json({ error: "Erro ao deletar usuário" });
  }
};
