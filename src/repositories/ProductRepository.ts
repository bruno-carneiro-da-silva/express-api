import { PrismaClient } from "@prisma/client";
import { IProduct } from "../types/Product";
const prisma = new PrismaClient();

class ProductRepository {
  async findAll(orderBy = "ASC") {
    const direction = orderBy.toUpperCase() === "DESC" ? "desc" : "asc";
    const products = await prisma.product.findMany({
      orderBy: {
        name: direction,
      },
      include: {
        category: true,
        stock: true,
        soldItems: true,
        transactions: true,
      },
    });
    return products;
  }

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        stock: true,
        soldItems: true,
        transactions: true,
      },
    });
    return product;
  }

  async findByCategoryId(categoryId: string) {
    const products = await prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
        stock: true,
        soldItems: true,
        transactions: true,
      },
    });
    return products;
  }

  async findByName(name: string) {
    const product = await prisma.product.findFirst({
      where: { name },
    });
    return product;
  }

  async create({ name, qtd, price, categoryId }: IProduct) {
    const product = await prisma.product.create({
      data: {
        name,
        qtd,
        price,
        categoryId,
      },
    });
    return product;
  }

  async update(
    id: string,
    {
      name,
      qtd,
      price,
      categoryId,
    }: { name: string; qtd: number; price: number; categoryId?: string }
  ) {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        qtd,
        price,
        categoryId,
      },
    });
    return product;
  }

  async delete(id: string) {
    const product = await prisma.product.delete({
      where: { id },
    });
    return product;
  }
}

export default new ProductRepository();