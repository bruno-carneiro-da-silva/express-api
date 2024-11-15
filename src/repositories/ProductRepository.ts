import { Prisma, PrismaClient } from "@prisma/client";
import { IProduct } from "../types/Product";
import { productSelect } from "../utils/selectors";
const prisma = new PrismaClient();

class ProductRepository {
  async findAll(orderBy = "ASC", page: number, limit: number, filter: string, companyId: string) {
    const direction = orderBy.toUpperCase() === "DESC" ? "desc" : "asc";

    const skip = (page - 1) * limit;
    let where: Prisma.ProductWhereInput = filter
      ? ({
          OR: [
            { name: { contains: filter, mode: "insensitive" } },
            { description: { contains: filter, mode: "insensitive" } },
          ],
        } as const)
      : {};

    where = { ...where, companyId }

    const products = await prisma.product.findMany({
      where,
      orderBy: {
        name: direction,
      },
      skip,
      take: limit,
      include: productSelect,
    });

    const total = await prisma.product.count({ where });

    return { products, total };
  }

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: productSelect,
    });
    return product;
  }

  async findByCategoryId(categoryId: string) {
    const products = await prisma.product.findMany({
      where: { categoryId },
      include: productSelect,
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
    description,
    // qtd,
    // size,
    price,
    categoryId,
    photos,
    companyId,
  }: IProduct) {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        qtd: 0,
        size: "",
        price,
        categoryId,
        photos: {
          create: photos.map((base64: string) => ({ base64 })),
        },
        companyId,
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
      throw new Error(`Produto ${productId} está no estoque mínimo.`);
    }
  }

  async update(
    id: string,
    {
      name,
      price,
      description,
      // qtd,
      // size,
      photos,
      categoryId,
      minStock,
    }: IProduct
  ) {
    // const existingPhotos = await prisma.photo.findMany({
    //   where: { productId: id },
    // });

    // const photosToRemove = existingPhotos.filter(
    //   (existingPhoto) => !photos.includes(existingPhoto.base64)
    // );

    // const photosToAdd = photos.filter(
    //   (base64) =>
    //     !existingPhotos.some((existingPhoto) => existingPhoto.base64 === base64)
    // );

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        description,
        qtd: 0,
        size: "",
        photos: {
          deleteMany: {},
          create: photos.map((base64: string) => ({ base64 })),
        },
        categoryId,
      },
    });

    // await prisma.photo.deleteMany({
    //   where: {
    //     id: { in: photosToRemove.map((photo) => photo.id) },
    //   },
    // });

    // await prisma.photo.createMany({
    //   data: photosToAdd.map((url) => ({ url, productId: id })),
    // });

    await prisma.stock.update({
      where: { productId: id },
      data: {
        qtd: 0,
        minStock,
      },
    });

    // await this.checkStockAndNotify(id);

    return product;
  }

  async delete(id: string) {
    const notify = this.checkStockAndNotify;
    const result = await prisma.$transaction(async (prisma) => {
      await prisma.photo.deleteMany({ where: { productId: id } });

      const product = await prisma.product.delete({
        where: { id },
      });

      await notify(id);

      return product;
    });

    return result;
  }
}

export default new ProductRepository();
