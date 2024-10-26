import { PrismaClient } from "@prisma/client";
import { IContact } from "../types/Contact";
const prisma = new PrismaClient();

class ContactsRepository {
  async findAll(orderBy = "ASC") {
    const direction = orderBy.toUpperCase() === "DESC" ? "desc" : "asc";
    const contacts = await prisma.contact.findMany({
      orderBy: {
        name: direction,
      },
      include: {
        category: true,
      },
    });
    return contacts;
  }

  async findById(id: string) {
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    return contact;
  }

  async findByEmail(email: string) {
    const contact = await prisma.contact.findUnique({
      where: { email },
    });
    return contact;
  }

  async create({ name, email, phone, companyId, categoryId }: IContact) {
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        companyId,
        categoryId,
      },
    });
    return contact;
  }

  async update(
    id: string,
    { name, email, phone, companyId, categoryId }: IContact
  ) {
    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        throw new Error("Categoria não encontrada");
      }
    }

    if (companyId) {
      const companyExists = await prisma.company.findUnique({
        where: { id: companyId },
      });

      if (!companyExists) {
        throw new Error("Id da empresa inválido");
      }
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        companyId,
        categoryId,
      },
    });
    return contact;
  }

  async delete(id: string) {
    const contact = await prisma.contact.delete({
      where: { id },
    });
    return contact;
  }
}

export default new ContactsRepository();
