import { RequestHandler } from "express";
import TransactionRepository from "../repositories/TransactionRepository";
import { z } from "zod";
import ProductRepository from "../repositories/ProductRepository";
import EmployeeRepository from "../repositories/EmployeeRepository";
import SupplierRepository from "../repositories/SupplierRepository";

export const index: RequestHandler = async (request, response) => {
  try {
    const { orderBy } = request.query;
    const transactions = await TransactionRepository.findAll(orderBy as string);
    return response.json(transactions);
  } catch (error) {
    response.status(500).json({ error: "Erro ao buscar transações" });
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
    const transaction = await TransactionRepository.findById(id);

    if (!transaction) {
      return response.status(404).json({ error: "Transação inexistente" });
    }
    response.json(transaction);
  } catch (error) {
    response.status(500).json({ error: "Erro ao buscar transação" });
  }
};

export const store: RequestHandler = async (request, response) => {
  try {
    const {
      productId,
      employeeId,
      supplierCnpj,
      qtd,
      totalPrice,
      selledPrice,
    } = request.body;

    const addTransactionSchema = z.object({
      productId: z.string(),
      employeeId: z.string(),
      supplierCnpj: z.string(),
      qtd: z.number(),
      totalPrice: z.number(),
      selledPrice: z.number(),
    });

    const body = addTransactionSchema.safeParse(request.body);

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Existem campos não preenchidos" });
    }

    const productExists = await TransactionRepository.findById(productId);

    if (!productExists) {
      return response.status(400).json({ error: "Produto não encontrado" });
    }

    const employeeExists = await TransactionRepository.findById(employeeId);

    if (!employeeExists) {
      return response.status(400).json({ error: "Funcionário não encontrado" });
    }

    const supplierExists = await TransactionRepository.findById(supplierCnpj);

    if (!supplierExists) {
      return response.status(400).json({ error: "Fornecedor não encontrado" });
    }

    const transaction = await TransactionRepository.create({
      productId,
      employeeId,
      supplierCnpj,
      qtd,
      totalPrice,
      selledPrice,
    });
    response.json(transaction);
  } catch (error) {
    response.status(500).json({ error: "Erro ao criar transação" });
  }
};

export const update: RequestHandler = async (request, response) => {
  try {
    const {
      productId,
      employeeId,
      supplierCnpj,
      qtd,
      totalPrice,
      selledPrice,
    } = request.body;
    const { id } = request.params;
    const validateSchemaId = z.string();
    const updateTransactionSchema = z.object({
      productId: z.string(),
      employeeId: z.string(),
      supplierCnpj: z.string(),
      qtd: z.number(),
      totalPrice: z.number(),
      selledPrice: z.number(),
    });
    const idBody = validateSchemaId.safeParse(id);
    const body = updateTransactionSchema.safeParse(request.body);

    if (!body.success) {
      return response
        .status(400)
        .json({ error: "Existem campos não preenchidos" });
    }

    if (!idBody.success) {
      return response.status(400).json({ error: "ID inválido" });
    }
    const productExists = await ProductRepository.findById(productId);
    const employeeExists = await EmployeeRepository.findById(employeeId);
    const supplierExists = await SupplierRepository.findByDoc(supplierCnpj);
    const transactionExists = await TransactionRepository.findById(id);

    if (!transactionExists) {
      return response.status(404).json({ error: "Transação não encontrada" });
    }

    if (!productExists) {
      return response.status(400).json({ error: "Produto não encontrado" });
    }

    if (!employeeExists) {
      return response.status(400).json({ error: "Funcionário não encontrado" });
    }

    if (!supplierExists) {
      return response.status(400).json({ error: "Fornecedor não encontrado" });
    }

    const transaction = await TransactionRepository.update(id, {
      productId,
      employeeId,
      supplierCnpj,
      qtd,
      totalPrice,
      selledPrice,
    });
    response.json(transaction);
  } catch (error) {
    response.status(500).json({ error: "Erro ao atualizar transação" });
  }
};

export const deleteTransaction: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const validateIdSchema = z.string();

    const body = validateIdSchema.safeParse(id);

    if (!body.success) {
      return response.status(400).json({ error: "ID inválido" });
    }
    const transactionExists = await TransactionRepository.findById(id);

    if (!transactionExists) {
      return response.status(404).json({ error: "Transação não encontrada" });
    }

    await TransactionRepository.delete(id);
    response.sendStatus(204);
  } catch (error) {
    response.status(500).json({ error: "Erro ao deletar transação" });
  }
};
