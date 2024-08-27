import { RequestHandler } from "express";
import TransactionRepository from "../repositories/TransactionRepository";

export const index: RequestHandler = async (request, response) => {
  const { orderBy } = request.query;
  const transactions = await TransactionRepository.findAll(orderBy as string);
  return response.json(transactions);
};

export const show: RequestHandler = async (request, response) => {
  const { id } = request.params;
  const transaction = await TransactionRepository.findById(id);

  if (!transaction) {
    return response.status(404).json({ error: "Transação inexistente" });
  }
  response.json(transaction);
};

export const store: RequestHandler = async (request, response) => {
  const { productId, employeeId, supplierCnpj, qtd, totalPrice, selledPrice } =
    request.body;

  if (
    !productId ||
    !employeeId ||
    !supplierCnpj ||
    !qtd ||
    !totalPrice ||
    !selledPrice
  ) {
    return response
      .status(400)
      .json({ error: "Existem campos não preenchidos" });
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
};

export const update: RequestHandler = async (request, response) => {
  const { productId, employeeId, supplierCnpj, qtd, totalPrice, selledPrice } =
    request.body;
  const { id } = request.params;
  const transactionExists = await TransactionRepository.findById(id);

  if (!transactionExists) {
    return response.status(404).json({ error: "Transação não encontrada" });
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
};

export const deleteTransaction: RequestHandler = async (request, response) => {
  const { id } = request.params;

  await TransactionRepository.delete(id);
  response.sendStatus(204);
};
