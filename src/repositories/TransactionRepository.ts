import { PrismaClient } from "@prisma/client";
import { ITransaction } from "../types/Transaction";
const prisma = new PrismaClient();

class TransactionRepository {
  async findAll(orderBy = "ASC") {
    const direction = orderBy.toUpperCase() === "DESC" ? "desc" : "asc";
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        createdAt: direction,
      },
      include: {
        product: true,
        employee: true,
        supplier: true,
      },
    });
    return transactions;
  }

  async findById(id: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        product: true,
        employee: true,
        supplier: true,
      },
    });
    return transaction;
  }

  async create({
    productId,
    employeeId,
    supplierCnpj,
    qtd,
    totalPrice,
    selledPrice,
  }: ITransaction) {
    const transaction = await prisma.transaction.create({
      data: {
        productId,
        employeeId,
        supplierCnpj,
        qtd,
        totalPrice,
        selledPrice,
      },
    });
    return transaction;
  }

  async update(
    id: string,
    {
      productId,
      employeeId,
      supplierCnpj,
      qtd,
      totalPrice,
      selledPrice,
    }: {
      productId: string;
      employeeId: string;
      supplierCnpj: string;
      qtd: number;
      totalPrice: number;
      selledPrice: number;
    }
  ) {
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        productId,
        employeeId,
        supplierCnpj,
        qtd,
        totalPrice,
        selledPrice,
      },
    });
    return transaction;
  }

  async delete(id: string) {
    const transaction = await prisma.transaction.delete({
      where: { id },
    });
    return transaction;
  }
}

export default new TransactionRepository();
