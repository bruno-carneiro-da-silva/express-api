import "dotenv/config";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import SupplierRepository from "../repositories/SupplierRepository";

export const index: RequestHandler = async (request, response) => {
  try {
    const { orderBy, page = "1", filter = '' } = request.query;
    const per_page = 4

    const { suppliers, total } = await SupplierRepository.findAll(orderBy as string, Number(page), per_page, filter as string);

    return response.json({ suppliers, total, per_page });
  } catch (error) {
    response.status(500).json({ error: "Erro interno, tente mais tarde" });
  }
};

export const show: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const idSchema = z.string();

    const body = idSchema.safeParse(id);

    if (!body.success) {
      return response.status(400).json({ error: "ID inválido" });
    }

    const supplier = await SupplierRepository.listOne(id);

    if (!supplier) {
      return response.status(404).json({ error: "Fornecedor não existe" });
    }
    response.json(supplier);
  } catch (error) {
    response
      .status(500)
      .json({ error: "Erro ao buscar fornecedor, tente mais tarde" });
  }
};

export const showByCnpj: RequestHandler = async (request, response) => {
  try {
    const { cnpj } = request.params;
    const cnpjSchema = z.string();

    const body = cnpjSchema.safeParse(cnpj);

    if (!body.success) {
      return response.status(400).json({ error: "CNPJ inválido" });
    }

    const supplier = await SupplierRepository.findByDoc(cnpj);

    if (!supplier) {
      return response.status(404).json({ error: "Fornecedor não existe" });
    }
    response.json(supplier);
  } catch (error) {
    response
      .status(500)
      .json({ error: "Erro ao buscar fornecedor, tente mais tarde" });
  }
};

export const store: RequestHandler = async (request, response) => {
  try {
    const {
      name,
      address,
      cnpj,
      corporateReason,
      email,
      phone,
      lastName,
      nationality,
      niche,
      city,
      photo,
    } = request.body;

    const supplierSchema = z.object({
      name: z.string(),
      address: z.string(),
      cnpj: z.string(),
      corporateReason: z.string(),
      email: z.string().email(),
      phone: z.string(),
      lastName: z.string(),
      dateOfBirth: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date)
          return new Date(arg);
      }, z.date()),
      nationality: z.string(),
      niche: z.string(),
      city: z.string(),
      photo: z.string(),
      startContractDate: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date)
          return new Date(arg);
      }, z.date()),
      endContractDate: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date)
          return new Date(arg);
      }, z.date()),
    });

    const body = supplierSchema.safeParse(request.body);

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const supplierExists = await SupplierRepository.findByDoc(cnpj);
    if (supplierExists) {
      return response.status(400).json({ error: "Este CNPJ já esta em uso" });
    }

    const emailExists = await SupplierRepository.findByEmail(email);

    if (emailExists) {
      return response.status(400).json({ error: "Este email já está em uso" });
    }

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const supplier = await SupplierRepository.create({
      name,
      address,
      cnpj,
      corporateReason,
      email,
      phone,
      lastName,
      dateOfBirth: body.data.dateOfBirth,
      nationality,
      niche,
      city,
      photo,
      startContractDate: body.data.startContractDate,
      endContractDate: body.data.endContractDate,
      userId: decoded.userId,
    });

    return response.status(201).json(supplier);
  } catch (error) {
    response
      .status(500)
      .json({ error: "Erro ao criar o fornecedor, tente mais tarde" });
  }
};

export const update: RequestHandler = async (request, response) => {
  try {
    const {
      name,
      address,
      cnpj,
      corporateReason,
      email,
      phone,
      lastName,
      dateOfBirth,
      nationality,
      niche,
      city,
      photo,
      startContractDate,
      endContractDate,
    } = request.body;
    const { id } = request.params;

    const updateSupplierSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string(),
      cnpj: z.string(),
      address: z.string(),
      corporateReason: z.string(),
      lastName: z.string(),
      dateOfBirth: z.date(),
      nationality: z.string(),
      niche: z.string(),
      city: z.string(),
      photo: z.string(),
      startContractDate: z.date(),
      endContractDate: z.date(),
    });

    const body = updateSupplierSchema.safeParse(request.body);

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const supplierExists = await SupplierRepository.findByDoc(cnpj);

    if (!supplierExists) {
      return response.status(404).json({ error: "Fornecedor inexistente" });
    }

    const emailExists = await SupplierRepository.findByEmail(email);

    if (emailExists && emailExists.id !== id) {
      return response.status(400).json({ error: "Este email já está em uso" });
    }

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const supplier = await SupplierRepository.update(id, {
      name,
      email,
      phone,
      cnpj,
      address,
      corporateReason,
      lastName,
      dateOfBirth,
      nationality,
      niche,
      city,
      photo,
      startContractDate,
      endContractDate,
      userId: decoded.userId,
    });
    response.json(supplier);
  } catch (error) {
    response
      .status(500)
      .json({ error: "Erro ao atualizar o fornecedor, tente mais tarde" });
  }
};

export const deleteSupplier: RequestHandler = async (request, response) => {
  try {
    const idSchema = z.object({ id: z.string() });

    const body = idSchema.safeParse(request.params);

    if (!body.success) {
      return response.status(400).json({ error: "ID inválido" });
    }

    const id = body.data.id;
    const supplierExists = await SupplierRepository.listOne(id);

    if (!supplierExists) {
      return response.status(404).json({ error: "Fornecedor não encontrado" });
    }

    await SupplierRepository.delete(id);
    response.sendStatus(204);
  } catch (error) {
    response
      .status(500)
      .json({ error: "Erro ao tentar deletar o fornecedor, tente mais tarde" });
  }
};
