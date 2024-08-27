import { PrismaClient } from "@prisma/client";
import { IUser } from "../types/User";
const prisma = new PrismaClient();

class UsersRepository {
  async findAll(orderBy = "ASC") {
    const direction = orderBy.toUpperCase() === "DESC" ? "desc" : "asc";
    const users = await prisma.user.findMany({
      orderBy: {
        username: direction,
      },
    });
    return users;
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async findByUsername(username: string) {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    return user;
  }

  async create({ username, password, role }: IUser) {
    const user = await prisma.user.create({
      data: {
        username,
        password,
        role,
      },
    });
    return user;
  }

  async update(
    id: string,
    {
      username,
      password,
      role,
    }: { username: string; password: string; role: string }
  ) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        username,
        password,
        role,
      },
    });
    return user;
  }

  async delete(id: string) {
    const user = await prisma.user.delete({
      where: { id },
    });
    return user;
  }
}

export default new UsersRepository();
