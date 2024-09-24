import { RequestHandler } from "express";
import SupplierRepository from "../repositories/SupplierRepository";
import { z } from "zod";

export const index: RequestHandler = async (request, response) => {
  try {
    const { orderBy } = request.query;
    const suppliers = await SupplierRepository.findAll(orderBy as string);
    return response.json(suppliers);
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
      dateOfBirth,
      nationality,
      niche,
    } = request.body;

    const supplierSchema = z.object({
      name: z.string(),
      address: z.string(),
      cnpj: z.string(),
      corporateReason: z.string(),
      email: z.string().email(),
      phone: z.string(),
      lastName: z.string(),
      dateOfBirth: z.date(),
      nationality: z.string(),
      niche: z.string(),
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

    const supplier = await SupplierRepository.create({
      name,
      address,
      cnpj,
      phone,
      corporateReason,
      email,
      lastName,
      dateOfBirth,
      nationality,
      niche,
    });
    response.json(supplier);
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
    const { id } = request.params;
    const idSchema = z.string();

    const body = idSchema.safeParse(request.params);

    if (!body.success) {
      return response.status(400).json({ error: "ID inválido" });
    }
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
