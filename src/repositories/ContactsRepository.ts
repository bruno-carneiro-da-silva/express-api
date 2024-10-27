import { PrismaClient } from "@prisma/client";
import { IContact } from "../types/Contact";
const prisma = new PrismaClient();

class ContactsRepository {
  async findAll(orderBy = "ASC", page: number, limit: number) {
    const direction = orderBy.toUpperCase() === "DESC" ? "desc" : "asc";
    const skip = (page - 1) * limit;
    const contacts = await prisma.contact.findMany({
      orderBy: {
        name: direction,
      },
      skip,
      take: limit,
    });
    const total = await prisma.contact.count()
    return { contacts, total };
  }

  async findById(id: string) {
    const contact = await prisma.contact.findUnique({
      where: { id },
    });
    return contact;
  }

  async findByEmail(email: string) {
    const contact = await prisma.contact.findUnique({
      where: { email },
    });
    return contact;
  }

  async create({ name, email, phone, address, zip, birthday, companyId }: IContact) {
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        address,
        zip,
        birthday,
        companyId,
      },
    });
    return contact;
  }

  async update(
    id: string,
    { name, email, phone, address, zip, birthday, companyId }: IContact
  ) {
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
        address,
        zip,
        birthday,
        companyId,
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
