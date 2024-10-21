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
        photos: true,
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
        photos: true,
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
        photos: true,
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

  async create({
    name,
    qtd,
    description,
    size,
    price,
    categoryId,
    photos,
  }: IProduct) {
    const product = await prisma.product.create({
      data: {
        name,
        qtd,
        description,
        size,
        price,
        categoryId,
        photos: {
          create: photos.map((url: string) => ({ url })),
        },
      },
      include: {
        photos: true,
      },
    });
    return product;
  }

  async checkStockAndNotify(productId: string) {
    const stock = await prisma.stock.findUnique({
      where: { productId },
    });

    if (stock && stock.qtd <= stock.minStock) {
      // Lógica para notificar o usuário
      console.log(`Produto ${productId} está no estoque mínimo.`);
      // Aqui você pode enviar um email, uma notificação, etc.
    }
  }

  async update(
    id: string,
    {
      name,
      qtd,
      price,
      description,
      size,
      photos,
      categoryId,
      minStock,
    }: IProduct
  ) {

    const existingPhotos = await prisma.photo.findMany({
      where: { productId: id },
    });

    const photosToRemove = existingPhotos.filter(
      (existingPhoto) => !photos.includes(existingPhoto.url)
    );

    const photosToAdd = photos.filter(
      (url) =>
        !existingPhotos.some((existingPhoto) => existingPhoto.url === url)
    );

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        qtd,
        price,
        description,
        size,
        photos: {
          deleteMany: {},
          create: photos.map((url: string) => ({ url })),
        },
        categoryId,
      },
    });

    await prisma.photo.deleteMany({
      where: {
        id: { in: photosToRemove.map((photo) => photo.id) },
      },
    });

    await prisma.photo.createMany({
      data: photosToAdd.map((url) => ({ url, productId: id })),
    });

    await prisma.stock.update({
      where: { productId: id },
      data: {
        qtd,
        minStock,
      },
    });

    await this.checkStockAndNotify(id);

    return product;
  }

  async delete(id: string) {
    const product = await prisma.product.delete({
      where: { id },
    });

    await this.checkStockAndNotify(id);

    return product;
  }
}

export default new ProductRepository();
