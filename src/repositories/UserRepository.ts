import { PrismaClient } from "@prisma/client";
import { IUser } from "../types/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { emailAdmin: email },
    });
    return user;
  }

  async findByAccessToken(accessToken: string) {
    const decoded = jwt.decode(accessToken) as { email: string };
    const user = await prisma.user.findUnique({
      where: { emailAdmin: decoded.email },
    });
    return user;
  }

  async findByRefreshToken(refreshToken: string) {
    const user = await prisma.user.findFirst({
      where: { refreshToken },
    });
    return user;
  }

  async create({
    firstName,
    lastName,
    emailAdmin,
    phoneNumberAdmin,
    nameCompany,
    emailCompany,
    phoneNumberCompany,
    addressCompany,
    terms,
    username,
    password,
    role,
  }: IUser) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        emailAdmin,
        phoneNumberAdmin,
        nameCompany,
        emailCompany,
        phoneNumberCompany,
        addressCompany,
        terms,
        username,
        password: hashedPassword,
        role,
      },
    });
    return user;
  }

  async update(
    id: string,
    {
      firstName,
      lastName,
      emailAdmin,
      phoneNumberAdmin,
      nameCompany,
      emailCompany,
      phoneNumberCompany,
      addressCompany,
      terms,
      username,
      password,
      role,
    }: IUser
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        emailAdmin,
        phoneNumberAdmin,
        nameCompany,
        emailCompany,
        phoneNumberCompany,
        addressCompany,
        terms,
        username,
        password: hashedPassword,
        role,
      },
    });
    return user;
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        refreshToken,
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
