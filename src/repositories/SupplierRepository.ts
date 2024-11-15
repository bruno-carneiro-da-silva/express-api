import { Prisma, PrismaClient } from "@prisma/client";
import { ISupplier } from "../types/Supplier";
const prisma = new PrismaClient();

class SupplierRepository {
  async findAll(orderBy = "ASC", page: number, limit: number, filter: string, companyId: string) {
    const direction = orderBy.toUpperCase() === "DESC" ? "desc" : "asc";
    const skip = (page - 1) * limit;

    let where: Prisma.SupplierWhereInput = filter
      ? ({
        OR: [
          { name: { contains: filter, mode: "insensitive" } },
          { email: { contains: filter, mode: "insensitive" } },
          { phone: { contains: filter, mode: "insensitive" } },
          { address: { contains: filter, mode: "insensitive" } },
        ],
      } as const)
      : {};

    where = { ...where, companyId }

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

    const total = await prisma.supplier.count({ where });

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
    phone,
    corporateReason,
    email,
    lastName,
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
        corporateReason,
        email,
        lastName,
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

  async findByDoc(cnpj: string, companyId: string) {
    const supplier = await prisma.supplier.findUnique({
      where: { cnpj, companyId },
    });
    return supplier;
  }

  async findByEmail(email: string, companyId: string) {
    const supplier = await prisma.supplier.findUnique({
      where: { email, companyId },
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
      phone,
      corporateReason,
      email,
      lastName,
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
        corporateReason,
        email,
        lastName,
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
