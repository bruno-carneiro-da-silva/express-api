import { RequestHandler } from "express";
import SalesRepository from "../repositories/SalesRepository";
import { z } from "zod";
import EmployeeRepository from "../repositories/EmployeeRepository";
import CompaniesRepository from "../repositories/CompanyRepository";
import { InsufficientStockError } from "../error/InsufficientStockError";
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

    const totalSales = await SalesRepository.findTotalSales();

    response.json({ sales, total, per_page, totalSales });
  } catch {
    response.status(500).json({ error: "Erro ao buscar contatos" });
  }
};

export const show: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const saleShowSchema = z.string();

    const body = saleShowSchema.safeParse(id);

    if (!body.success) {
      return response.status(500).json({ error: "ID inválido" });
    }

    const sale = await SalesRepository.findById(id);

    if (!sale) {
      return response.status(500).json({ error: "Pedido não encontrado" });
    }
    response.json(sale);
  } catch {
    response.status(500).json({ error: "Erro ao buscar a venda" });
  }
};

export const store: RequestHandler = async (request, response) => {
  try {
    const addSaleSchema = z.object({
      employeeId: z.string(),
      companyId: z.string(),
      discount: z.number(),
      totalPrice: z.number(),
      paymentStatus: z.enum(["PAID", "PENDING", "REFUSED", "CANCELED"]),
      soldItems: z.array(
        z.object({ productId: z.string(), qtd: z.number(), price: z.number() })
      ),
    });

    const body = addSaleSchema.safeParse(request.body);
    if (!body.success) {
      return response.status(400).json({
        error: "Todos os campos são obrigatórios",
        details: body.error.errors,
      });
    }

    const {
      employeeId,
      totalPrice,
      paymentStatus,
      discount,
      soldItems,
    } = body.data;
    const employeeExists = await EmployeeRepository.findById(employeeId);

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).json({ error: "Token não fornecido" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const companyExists = await CompaniesRepository.findById(decoded.userId);

    if (!employeeExists) {
      return response.status(404).json({ error: "Funcionário não encontrado" });
    }

    if (!companyExists) {
      return response.status(404).json({ error: "Usuário não encontrado" });
    }

    const sale = await SalesRepository.create({
      employeeId,
      companyId: decoded.userId,
      totalPrice,
      paymentStatus,
      discount,
      soldItems,
    });
    response.status(201).json(sale);
  } catch (error) {
    if (error instanceof InsufficientStockError) {
      return response.status(400).json({ error: error.message });
    }
    response.status(500).json({ error: "Erro ao criar a venda" });
  }
};

export const update: RequestHandler = async (request, response) => {
  try {
    const {
      employeeId,
      totalPrice,
      paymentStatus,
      discount,
      soldItems,
    } = request.body;
    const { id } = request.params;
    const updateIdSchema = z.string();
    const updateSaleSchema = z.object({
      employeeId: z.string(),
      totalPrice: z.number(),
      paymentStatus: z.enum(["PAID", "PENDING", "REFUSED", "CANCELED"]),
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
        error: "Todos os campos são obrigatórios",
      });
    }

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).json({ error: "Token não fornecido" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const saleExists = await SalesRepository.findById(id);

    if (!saleExists) {
      return response.status(404).json({ error: "Pedido não encontrado" });
    }

    const employeeExists = await EmployeeRepository.findById(employeeId);
    const companyExists = await CompaniesRepository.findById(decoded.userId);
    if (!employeeExists) {
      return response.status(404).json({ error: "Funcionário não encontrado" });
    }

    if (!companyExists) {
      return response.status(404).json({ error: "Usuário não encontrado" });
    }

    const sale = await SalesRepository.update(id, {
      employeeId,
      companyId: decoded.userId,
      totalPrice,
      paymentStatus,
      discount,
      soldItems,
    });
    response.status(201).json(sale);
  } catch (error) {
    if (error instanceof InsufficientStockError) {
      return response.status(400).json({ error: error.message });
    }
    response.status(500).json({ error: "Erro ao criar a venda" });
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
  } catch {
    response.status(500).json({ error: "Erro ao deletar a venda" });
  }
};
