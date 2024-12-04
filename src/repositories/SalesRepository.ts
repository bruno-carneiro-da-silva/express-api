import { PrismaClient, Prisma, Sale } from "@prisma/client";
import { ISale } from "../types/Sale";
import { saleCompanySelect, employeeSelect } from "../utils/selectors";
import { InsufficientStockError } from "../error/InsufficientStockError";

const prisma = new PrismaClient();

class SalesRepository {
  async findAll(
    orderBy = "ASC",
    page: number,
    limit: number,
    filter: string,
    companyId: string
  ) {
    const direction = orderBy.toUpperCase() === "DESC" ? "desc" : "asc";
    const skip = (page - 1) * limit;

    let where: Prisma.SaleWhereInput = filter
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
      : {};

    where = { ...where, companyId };

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

  async handleStock(
    prisma: Prisma.TransactionClient,
    soldItems: ISale["soldItems"],
    paymentStatus: ISale["paymentStatus"],
    oldSale?: Sale
  ) {
    const updateStock = async ({
      items,
      adding,
    }: {
      items: ISale["soldItems"];
      adding: boolean;
    }) => {
      for (const item of items) {
        const stock = await prisma.stock.findUnique({
          where: { productId: item.productId },
        });

        if (stock) {
          const qtd = adding ? stock.qtd + item.qtd : stock.qtd - item.qtd;
          console.log("updating new qtd", qtd);
          await prisma.stock.update({
            where: { productId: item.productId },
            data: {
              qtd,
            },
          });
        }
      }
    };

    if (oldSale) {
      const oldSoldItems = await prisma.soldItem.findMany({
        where: { saleId: oldSale.id },
      });
      if (oldSoldItems) {
        // devolver estoque dos antigos produtos
        await updateStock({ items: oldSoldItems, adding: true });
      }
      await prisma.soldItem.deleteMany({
        where: { saleId: oldSale.id },
      });

      if (paymentStatus !== "CANCELED") {
        // caso a venda não foi cancelada atualizar o estoque
        await updateStock({ items: soldItems, adding: false });
      }
    } else {
      // criando venda pela primeira vez: reduzir estoque dos produtos vendidos
      // checar se há estoque disponível
      for (const item of soldItems) {
        const stock = await prisma.stock.findUnique({
          where: { productId: item.productId },
        });

        if (
          !stock ||
          stock.qtd < item.qtd ||
          stock.qtd - item.qtd < stock.minStock
        ) {
          throw new InsufficientStockError(
            `Quantidade insuficiente ou estoque ultrapassou o estoque minimo do item`
          );
        }
      }
      // atualizar o estoque dos produtos vendidos
      await updateStock({ items: soldItems, adding: false });
    }
  }

  async create({
    employeeId,
    companyId,
    totalPrice,
    paymentStatus,
    discount,
    soldItems,
  }: ISale) {
    const result = await prisma.$transaction(async (prisma) => {
      await this.handleStock(prisma, soldItems, paymentStatus);

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

      return sale;
    });

    return result;
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
    const result = await prisma.$transaction(async (prisma) => {
      const oldSale = await prisma.sale.findUnique({ where: { id } });

      if (!oldSale) {
        throw new Error("Venda não encontrada!");
      }

      await this.handleStock(prisma, soldItems, paymentStatus, oldSale);

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

      return sale;
    });

    return result;
  }

  async delete(id: string) {
    return prisma.sale.delete({
      where: { id },
    });
  }
}

export default new SalesRepository();
