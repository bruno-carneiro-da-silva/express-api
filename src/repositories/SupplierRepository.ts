import { PrismaClient } from "@prisma/client";
import { ISupplier } from "../types/Supplier";
const prisma = new PrismaClient();

class SupplierRepository {
  async findAll(orderBy = "ASC") {
    const direction = orderBy.toUpperCase() === "DESC" ? "desc" : "asc";
    const suppliers = await prisma.supplier.findMany({
      orderBy: {
        name: direction,
      },
      include: {
        transactions: true,
        company: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            emailAdmin: true,
            phoneNumberAdmin: true,
          },
        },
      },
    });
    return suppliers;
  }

  async listOne(id: string) {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        transactions: true,
        company: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            emailAdmin: true,
            phoneNumberAdmin: true,
          },
        },
      },
    });
    return supplier;
  }

  async create({
    name,
    address,
    cnpj,
    city,
    photo,
    startContractDate,
    endContractDate,
    phone,
    corporateReason,
    email,
    lastName,
    dateOfBirth,
    nationality,
    niche,
    userId,
  }: ISupplier & { userId: string }) {
    const supplier = await prisma.supplier.create({
      data: {
        name,
        address,
        phone,
        cnpj,
        city,
        photo,
        startContractDate,
        endContractDate,
        corporateReason,
        email,
        lastName,
        dateOfBirth,
        nationality,
        niche,
        company: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return supplier;
  }

  async findByDoc(cnpj: string) {
    const supplier = await prisma.supplier.findUnique({
      where: { cnpj },
    });
    return supplier;
  }

  async findByEmail(email: string) {
    const supplier = await prisma.supplier.findUnique({
      where: { email },
    });
    return supplier;
  }

  async update(
    id: string,
    {
      name,
      address,
      cnpj,
      city,
      photo,
      startContractDate,
      endContractDate,
      phone,
      corporateReason,
      email,
      lastName,
      dateOfBirth,
      nationality,
      niche,
      userId,
    }: ISupplier & { userId: string }
  ) {
    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        name,
        address,
        phone,
        cnpj,
        city,
        photo,
        startContractDate,
        endContractDate,
        corporateReason,
        email,
        lastName,
        dateOfBirth,
        nationality,
        niche,
        company: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return supplier;
  }

  async delete(id: string) {
    const category = await prisma.category.delete({
      where: { id },
    });
    return category;
  }
}

export default new SupplierRepository();
