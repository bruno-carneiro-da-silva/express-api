import { PrismaClient, Prisma } from "@prisma/client";
import { ISale } from "../types/Sale";
import { saleCompanySelect, employeeSelect } from "../utils/selectors";

const prisma = new PrismaClient();

class SalesRepository {
  async findAll(orderBy = "ASC", page: number, limit: number, filter: string) {
    const direction = orderBy.toUpperCase() === "DESC" ? "desc" : "asc";
    const skip = (page - 1) * limit;

    const where: Prisma.SaleWhereInput | undefined = filter
      ? {
          OR: [
            { employee: { name: { contains: filter, mode: "insensitive" } } },
            {
              company: {
                emailAdmin: { contains: filter, mode: "insensitive" },
              },
            },
            {
              soldItems: {
                some: {
                  product: { name: { contains: filter, mode: "insensitive" } },
                },
              },
            },
          ],
        }
      : undefined;

    const sales = await prisma.sale.findMany({
      where,
      orderBy: {
        createdAt: direction,
      },
      skip,
      take: limit,
      select: {
        soldItems: {
          include: {
            product: {
              select: {
                name: true,
                photos: true,
                description: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        employee: {
          select: employeeSelect,
        },
        totalPrice: true,
        discount: true,
        companyId: true,
        paymentStatus: true,
        id: true,
      },
    });

    const total = await prisma.sale.count({ where });

    return { sales, total };
  }

  async findTotalSales() {
    const totalSales = await prisma.sale.aggregate({
      _sum: {
        totalPrice: true,
      },
    });

    return totalSales._sum.totalPrice || 0;
  }

  async findById(id: string) {
    return prisma.sale.findUnique({
      where: { id },
      include: {
        company: {
          select: saleCompanySelect,
        },
        soldItems: {
          include: {
            product: {
              select: {
                name: true,
                photos: true,
                description: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        employee: {
          select: employeeSelect,
        },
      },
    });
  }

  async create({
    employeeId,
    companyId,
    totalPrice,
    paymentStatus,
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
        paymentStatus,
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
        soldItems: {
          include: {
            product: {
              select: {
                name: true,
                photos: true,
                description: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
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
    {
      employeeId,
      companyId,
      totalPrice,
      paymentStatus,
      discount,
      soldItems,
    }: ISale
  ) {
    await prisma.soldItem.deleteMany({
      where: { saleId: id },
    });
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
        paymentStatus,
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
        soldItems: {
          include: {
            product: {
              select: {
                name: true,
                description: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
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
