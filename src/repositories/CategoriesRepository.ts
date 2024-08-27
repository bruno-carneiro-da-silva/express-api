import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class CategoriesRepository {
  async findAll() {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return categories;
  }

  async listOne(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    return category;
  }

  async create({ name }: { name: string }) {
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    return category;
  }

  async update(id: string, { name }: { name: string }) {
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
      },
    });
    return category;
  }

  async delete(id: string) {
    const category = await prisma.category.delete({
      where: { id },
    });
    return category;
  }
}

export default new CategoriesRepository();
