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
        emailAdmin: direction,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emailAdmin: true,
        phoneNumberAdmin: true,
        nameCompany: true,
        emailCompany: true,
        phoneNumberCompany: true,
        addressCompany: true,
        terms: true,
        role: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        planId: true,
        password: false,
        refreshToken: false,
        verificationCode: false,
        verificationCodeExpiresAt: false,
      },
    });
    return users;
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });
    return user;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { emailAdmin: email },
      include: {
        role: true,
      },
    });
    return user;
  }

  async findByAccessToken(accessToken: string) {
    const decoded = jwt.decode(accessToken) as { email: string };
    const user = await prisma.user.findUnique({
      where: { emailAdmin: decoded.email },
      include: {
        role: true,
      },
    });
    return user;
  }

  async findByRefreshToken(refreshToken: string) {
    const user = await prisma.user.findFirst({
      where: { refreshToken },
      include: {
        role: true,
      },
    });
    return user;
  }

  async findByPhoneNumber(phoneNumberAdmin: string) {
    const user = await prisma.user.findUnique({
      where: { phoneNumberAdmin: phoneNumberAdmin },
      include: {
        role: true,
      },
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
    password,
    roleId,
  }: IUser & { roleId: number }) {
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
        password: hashedPassword,
        roleId,
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
      password,
      roleId,
    }: IUser & { roleId: number }
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
        password: hashedPassword,
        roleId,
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

  async updateVerificationCode(email: string, code: string, expiresAt: Date) {
    const user = await prisma.user.update({
      where: { emailAdmin: email },
      data: {
        verificationCode: code,
        verificationCodeExpiresAt: expiresAt,
      },
    });
    return user;
  }

  async updatePasswordByPhoneNumber(
    phoneNumberAdmin: string,
    newPassword: string
  ) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await prisma.user.update({
      where: { phoneNumberAdmin: phoneNumberAdmin },
      data: {
        password: hashedPassword,
        verificationCode: null,
        verificationCodeExpiresAt: null,
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
