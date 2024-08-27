import { PrismaClient } from "@prisma/client";
import { ISale } from "../types/Sale";

const prisma = new PrismaClient();

class SalesRepository {
  async findAll(orderBy: string) {
    return prisma.sale.findMany({
      orderBy: {
        createdAt: orderBy === "desc" ? "desc" : "asc",
      },
      include: {
        employee: true,
        user: true,
        soldItems: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.sale.findUnique({
      where: { id },
      include: {
        employee: true,
        user: true,
        soldItems: true,
      },
    });
  }

  async create({ employeeId, userId, totalPrice, discount, soldItems }: ISale) {
    // Verificar se a quantidade solicitada está disponível no estoque
    for (const item of soldItems) {
      const stock = await prisma.stock.findUnique({
        where: { productId: item.productId },
      });

      if (!stock || stock.qtd < item.qtd) {
        throw new Error(
          `Quantidade insuficiente no estoque para o produto ${item.productId}`
        );
      }
    }

    const sale = await prisma.sale.create({
      data: {
        employeeId,
        userId,
        totalPrice,
        discount,
        soldItems: {
          create: soldItems.map((item) => ({
            productId: item.productId,
            qtd: item.qtd,
            price: item.price,
          })),
        },
      },
      include: {
        employee: true,
        user: true,
        soldItems: true,
      },
    });

    // Atualizar o estoque dos produtos vendidos
    for (const item of soldItems) {
      const stock = await prisma.stock.findUnique({
        where: { productId: item.productId },
      });

      if (stock) {
        await prisma.stock.update({
          where: { productId: item.productId },
          data: {
            qtd: stock.qtd - item.qtd,
          },
        });
      }
    }
    return sale;
  }

  async update(
    id: string,
    { employeeId, userId, totalPrice, discount, soldItems }: ISale
  ) {
    // Verificar se a quantidade solicitada está disponível no estoque
    for (const item of soldItems) {
      const stock = await prisma.stock.findUnique({
        where: { productId: item.productId },
      });

      if (!stock || stock.qtd < item.qtd) {
        throw new Error(
          `Quantidade insuficiente no estoque para o produto ${item.productId}`
        );
      }
    }

    const sale = await prisma.sale.update({
      where: { id },
      data: {
        employeeId,
        userId,
        totalPrice,
        discount,
        soldItems: {
          create: soldItems.map((item) => ({
            productId: item.productId,
            qtd: item.qtd,
            price: item.price,
          })),
        },
      },
      include: {
        employee: true,
        user: true,
        soldItems: true,
      },
    });

    // Atualizar o estoque dos produtos vendidos
    for (const item of soldItems) {
      const stock = await prisma.stock.findUnique({
        where: { productId: item.productId },
      });

      if (stock) {
        await prisma.stock.update({
          where: { productId: item.productId },
          data: {
            qtd: stock.qtd - item.qtd,
          },
        });
      }
    }

    return sale;
  }

  async delete(id: string) {
    return prisma.sale.delete({
      where: { id },
    });
  }
}

export default new SalesRepository();
