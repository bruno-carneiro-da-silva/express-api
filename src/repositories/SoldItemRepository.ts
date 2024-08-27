import { PrismaClient } from "@prisma/client";
import { ISoldItem } from "../types/SoldItems";
const prisma = new PrismaClient();

class SoldItemRepository {
  async findAll(orderBy = "ASC") {
    const direction = orderBy.toUpperCase() === "DESC" ? "desc" : "asc";
    const soldItems = await prisma.soldItem.findMany({
      orderBy: {
        createdAt: direction,
      },
      include: {
        product: true,
        sale: true,
      },
    });
    return soldItems;
  }

  async findById(id: string) {
    const soldItem = await prisma.soldItem.findUnique({
      where: { id },
      include: {
        product: true,
        sale: true,
      },
    });
    return soldItem;
  }

  async create({ saleId, productId, qtd, price }: ISoldItem) {
    const soldItem = await prisma.soldItem.create({
      data: {
        saleId,
        productId,
        qtd,
        price,
      },
    });
    return soldItem;
  }

  async update(
    id: string,
    { saleId, productId, qtd, price }: { saleId: string; productId: string; qtd: number; price: number }
  ) {
    const soldItem = await prisma.soldItem.update({
      where: { id },
      data: {
        saleId,
        productId,
        qtd,
        price,
      },
    });
    return soldItem;
  }

  async delete(id: string) {
    const soldItem = await prisma.soldItem.delete({
      where: { id },
    });
    return soldItem;
  }
}

export default new SoldItemRepository();
