import { RequestHandler } from "express";
import SalesRepository from "../repositories/SalesRepository";
import { z } from "zod";
import EmployeeRepository from "../repositories/EmployeeRepository";
import CompaniesRepository from "../repositories/CompanyRepository";

export const index: RequestHandler = async (request, response) => {
  const { orderBy } = request.query;
  const sales = await SalesRepository.findAll(orderBy as string);
  return response.json(sales);
};

export const show: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const saleShowSchema = z.string();

    const body = saleShowSchema.safeParse(id);

    if (!body.success) {
      return response.status(400).json({ error: "ID inválido" });
    }

    const sale = await SalesRepository.findById(id);

    if (!sale) {
      return response.status(404).json({ error: "Pedido não encontrado" });
    }
    response.json(sale);
  } catch (error) {
    response.status(500).json({ error: "Erro ao buscar a venda" });
  }
};

export const store: RequestHandler = async (request, response) => {
  try {
    const { employeeId, companyId, totalPrice, discount, soldItems } =
      request.body;

    const addSaleSchema = z.object({
      employeeId: z.string(),
      companyId: z.string(),
      totalPrice: z.number(),
      soldItems: z.array(
        z.object({ productId: z.string(), qtd: z.number(), price: z.number() })
      ),
    });

    const body = addSaleSchema.safeParse(request.body);

    if (!body.success) {
      return response.status(400).json({
        error: "Todos os campos são obrigatórios e soldItems deve ser um array",
      });
    }

    const employeeExists = await EmployeeRepository.findById(employeeId);
    const companyExists = await CompaniesRepository.findById(companyId);
    if (!employeeExists) {
      return response.status(404).json({ error: "Funcionário não encontrado" });
    }

    if (!companyExists) {
      return response.status(404).json({ error: "Usuário não encontrado" });
    }

    const sale = await SalesRepository.create({
      employeeId,
      companyId,
      totalPrice,
      discount,
      soldItems,
    });
    response.status(201).json(sale);
  } catch (error) {
    response.status(500).json({ error: "Erro ao criar a venda" });
  }
};

export const update: RequestHandler = async (request, response) => {
  try {
    const { employeeId, companyId, totalPrice, discount, soldItems } =
      request.body;
    const { id } = request.params;
    const updateIdSchema = z.string();
    const updateSaleSchema = z.object({
      employeeId: z.string(),
      companyId: z.string(),
      totalPrice: z.number(),
      discount: z.number(),
      soldItems: z.array(
        z.object({ productId: z.string(), qtd: z.number(), price: z.number() })
      ),
    });
    const idBody = updateIdSchema.safeParse(id);
    const body = updateSaleSchema.safeParse(request.body);

    if (!idBody.success) {
      return response.status(400).json({ error: "ID inválido" });
    }
    if (!body.success) {
      return response.status(400).json({
        error: "Todos os campos são obrigatórios e soldItems deve ser um array",
      });
    }
    const saleExists = await SalesRepository.findById(id);

    if (!saleExists) {
      return response.status(404).json({ error: "Pedido não encontrado" });
    }

    const employeeExists = await EmployeeRepository.findById(employeeId);
    const companyExists = await CompaniesRepository.findById(companyId);
    if (!employeeExists) {
      return response.status(404).json({ error: "Funcionário não encontrado" });
    }

    if (!companyExists) {
      return response.status(404).json({ error: "Usuário não encontrado" });
    }

    const sale = await SalesRepository.update(id, {
      employeeId,
      companyId,
      totalPrice,
      discount,
      soldItems,
    });
    response.status(201).json(sale);
  } catch (error) {
    response.status(500).json({ error: "Erro ao atualizar a venda" });
  }
};

export const deleteSale: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const deleteSaleIdSchema = z.string();

    const body = deleteSaleIdSchema.safeParse(id);

    if (!body.success) {
      return response.status(400).json({ error: "ID inválido" });
    }
    const saleExists = await SalesRepository.findById(id);

    if (!saleExists) {
      return response.status(404).json({ error: "Pedido não encontrado" });
    }
    await SalesRepository.delete(id);
    response.sendStatus(204);
  } catch (error) {
    response.status(500).json({ error: "Erro ao deletar a venda" });
  }
};
