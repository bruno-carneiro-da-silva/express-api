import { RequestHandler } from "express";
import SupplierRepository from "../repositories/SupplierRepository";

export const index: RequestHandler = async (request, response) => {
  const { orderBy } = request.query;
  const suppliers = await SupplierRepository.findAll(orderBy as string);
  return response.json(suppliers);
};

export const show: RequestHandler = async (request, response) => {
  const { id } = request.params;
  const supplier = await SupplierRepository.listOne(id);

  if (!supplier) {
    return response.status(404).json({ error: "Fornecedor não existe" });
  }
  response.json(supplier);
};

export const store: RequestHandler = async (request, response) => {
  const { name, address, cnpj, corporateReason, email, phone } = request.body;

  if (!name) {
    return response.status(400).json({ error: "O campo nome é obrigatório" });
  }
  const supplierExists = await SupplierRepository.findByDoc(cnpj);
  if (supplierExists) {
    return response.status(400).json({ error: "Este CNPJ já esta em uso" });
  }

  const supplier = await SupplierRepository.create({
    name,
    address,
    cnpj,
    phone,
    corporateReason,
    email,
  });
  response.json(supplier);
};

export const update: RequestHandler = async (request, response) => {
  const { name, email, phone, cnpj, address, corporateReason } = request.body;
  const { id } = request.params;
  const supplierExists = await SupplierRepository.update(id, {
    name,
    email,
    phone,
    cnpj,
    address,
    corporateReason,
  });

  if (!supplierExists) {
    return response.status(404).json({ error: "Fornecedor inexistente" });
  }

  if (!name) {
    return response.status(400).json({ error: "O campo nome é obrigatório" });
  }

  if (!email) {
    return response.status(400).json({ error: "O email é obrigatório" });
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
  });
  response.json(supplier);
};

export const deleteSupplier: RequestHandler = async (request, response) => {
  const { id } = request.params;

  await SupplierRepository.delete(id);
  response.sendStatus(204);
};
