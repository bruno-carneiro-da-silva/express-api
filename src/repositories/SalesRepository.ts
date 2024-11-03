import { PrismaClient } from "@prisma/client";
import { ISale } from "../types/Sale";
import { saleCompanySelect, employeeSelect } from "../utils/selectors";

const prisma = new PrismaClient();

class SalesRepository {
  async findAll(orderBy: string) {
    return prisma.sale.findMany({
      orderBy: {
        createdAt: orderBy === "desc" ? "desc" : "asc",
      },
      select: {
        soldItems: true,
        employee: {
          select: employeeSelect,
        },
        totalPrice: true,
        discount: true,
        companyId: true,
        id: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.sale.findUnique({
      where: { id },
      include: {
        employee: {
          select: employeeSelect,
        },
        company: {
          select: saleCompanySelect,
        },
        soldItems: true,
      },
    });
  }

  async create({
    employeeId,
    companyId,
    totalPrice,
    discount,
    soldItems,
  }: ISale) {
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
        companyId,
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
        employee: {
          select: employeeSelect,
        },
        company: {
          select: saleCompanySelect,
        },
        soldItems: true,
      },
    });

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
    { employeeId, companyId, totalPrice, discount, soldItems }: ISale
  ) {
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
        companyId,
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
        employee: {
          select: employeeSelect,
        },
        company: {
          select: saleCompanySelect,
        },
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
