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
      },
    });
    return suppliers;
  }

  async listOne(id: string) {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
    });
    return supplier;
  }

  async create({
    name,
    address,
    cnpj,
    phone,
    corporateReason,
    email,
    lastName,
    dateOfBirth,
    nationality,
    niche,
  }: ISupplier) {
    const supplier = await prisma.supplier.create({
      data: {
        name,
        address,
        phone,
        cnpj,
        corporateReason,
        email,
        lastName,
        dateOfBirth,
        nationality,
        niche,
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
    { name, email, phone, cnpj, address, corporateReason }: ISupplier
  ) {
    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        cnpj,
        address,
        corporateReason,
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
