import { PrismaClient } from "@prisma/client";
import { IStock } from "../types/Stock";
const prisma = new PrismaClient();

class StockRepository {
  async findAll(orderBy = "ASC") {
    const direction = orderBy.toUpperCase() === "DESC" ? "desc" : "asc";
    const stocks = await prisma.stock.findMany({
      orderBy: {
        productId: direction,
      },
      include: {
        product: true,
      },
    });
    return stocks;
  }

  async findById(id: string) {
    const stock = await prisma.stock.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
    return stock;
  }

  async findByProductId(productId: string) {
    const stock = await prisma.stock.findFirst({
      where: { productId },
      include: {
        product: true,
      },
    });
    return stock;
  }

  async create({ productId, capacity, qtd, minStock }: IStock) {
    const stock = await prisma.stock.create({
      data: {
        productId,
        capacity,
        qtd,
        minStock,
      },
    });
    return stock;
  }

  async update(
    id: string,
    {
      capacity,
      qtd,
      minStock,
    }: { capacity: number; qtd: number; minStock: number }
  ) {
    const stock = await prisma.stock.update({
      where: { id },
      data: {
        capacity,
        qtd,
        minStock,
      },
    });
    return stock;
  }

  async delete(id: string) {
    const stock = await prisma.stock.delete({
      where: { id },
    });
    return stock;
  }
}

export default new StockRepository();
