import { PrismaClient } from "@prisma/client";
import { IRole } from "../types/Role";
const prisma = new PrismaClient();

class RoleRepository {
  async findAll(orderBy = "ASC") {
    const direction = orderBy.toUpperCase() === "DESC" ? "desc" : "asc";
    const roles = await prisma.role.findMany({
      orderBy: {
        name: direction,
      },
    });
    return roles;
  }

  async findById(id: string) {
    const roles = await prisma.role.findUnique({
      where: { uId: id },
    });
    return roles;
  }

  async findByName(name: string) {
    const role = await prisma.role.findFirst({
      where: { name },
    });
    return role;
  }

  async create({ name, permissions }: IRole) {
    const role = await prisma.role.create({
      data: {
        name,
        permissions,
      },
    });
    return role;
  }

  async update(id: string, { name, permissions }: IRole) {
    const role = await prisma.role.update({
      where: { uId: id },
      data: {
        name,
        permissions,
      },
    });
    return role;
  }

  async delete(id: string) {
    const role = await prisma.role.delete({
      where: { uId: id },
    });
    return role;
  }
}

export default new RoleRepository();
