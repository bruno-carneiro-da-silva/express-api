import { Prisma, PrismaClient } from "@prisma/client";
import { ISupplier } from "../types/Supplier";
const prisma = new PrismaClient();

class SupplierRepository {
  async findAll(orderBy = "ASC", page: number, limit: number, filter: string) {
    const direction = orderBy.toUpperCase() === "DESC" ? "desc" : "asc";
    const skip = (page - 1) * limit;

    const where: Prisma.SupplierWhereInput | undefined = filter
      ? {
        OR: [
          { name: { contains: filter, mode: 'insensitive' } },
          { email: { contains: filter, mode: 'insensitive' } },
          { phone: { contains: filter, mode: 'insensitive' } },
          { address: { contains: filter, mode: 'insensitive' } },
        ],
      } as const
      : undefined

    const suppliers = await prisma.supplier.findMany({
      where,
      orderBy: {
        name: direction,
      },
      skip,
      take: limit,
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

    const total = await prisma.supplier.count({ where })

    return { suppliers, total };
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
        photo_base64: photo,
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
        photo_base64: photo,
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
    const supplier = await prisma.supplier.delete({
      where: { id },
    });
    return supplier;
  }
}

export default new SupplierRepository();
