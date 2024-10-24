import { PrismaClient } from "@prisma/client";
import { IUser } from "../types/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

class CompaniesRepository {
  async findAll(orderBy = "ASC") {
    const direction = orderBy.toUpperCase() === "DESC" ? "desc" : "asc";
    const companies = await prisma.company.findMany({
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
        _count: {
          select: { contacts: true, suppliers: true, sales: true },
        },
      },
    });
    return companies;
  }

  async findById(id: string) {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });
    return company;
  }

  async findByEmail(email: string) {
    const company = await prisma.company.findUnique({
      where: { emailAdmin: email },
      include: {
        role: true,
      },
    });
    return company;
  }

  async findByAccessToken(accessToken: string) {
    const decoded = jwt.decode(accessToken) as { email: string };
    const company = await prisma.company.findUnique({
      where: { emailAdmin: decoded.email },
      include: {
        role: true,
      },
    });
    return company;
  }

  async findByRefreshToken(refreshToken: string) {
    const company = await prisma.company.findFirst({
      where: { refreshToken },
      include: {
        role: true,
      },
    });
    return company;
  }

  async findByPhoneNumber(phoneNumberAdmin: string) {
    const company = await prisma.company.findUnique({
      where: { phoneNumberAdmin },
      include: {
        role: true,
      },
    });
    return company;
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
    const company = await prisma.company.create({
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
    const { password: _, ...companyWithoutPassword } = company;
    return companyWithoutPassword;
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
    const company = await prisma.company.update({
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
    return company;
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const company = await prisma.company.update({
      where: { id },
      data: {
        refreshToken,
      },
    });
    return company;
  }

  async updateVerificationCode(email: string, code: string, expiresAt: Date) {
    const company = await prisma.company.update({
      where: { emailAdmin: email },
      data: {
        verificationCode: code,
        verificationCodeExpiresAt: expiresAt,
      },
    });
    return company;
  }

  async updatePasswordByPhoneNumber(
    phoneNumberAdmin: string,
    newPassword: string
  ) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const company = await prisma.company.update({
      where: { phoneNumberAdmin: phoneNumberAdmin },
      data: {
        password: hashedPassword,
        verificationCode: null,
        verificationCodeExpiresAt: null,
      },
    });
    return company;
  }

  async delete(id: string) {
    const company = await prisma.company.delete({
      where: { id },
    });
    return company;
  }
}

export default new CompaniesRepository();
