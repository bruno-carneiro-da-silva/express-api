import { PrismaClient } from "@prisma/client";
import { IEmployee } from "../types/Employee";
const prisma = new PrismaClient();

class EmployeeRepository {
  async findAll(orderBy = "ASC") {
    const direction = orderBy.toUpperCase() === "DESC" ? "desc" : "asc";
    const employees = await prisma.employee.findMany({
      orderBy: {
        name: direction,
      },
      include: {
        transactions: true,
        sales: true,
      },
    });
    return employees;
  }

  async findById(id: string) {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        transactions: true,
        sales: true,
      },
    });
    return employee;
  }

  async findByEmail(email: string) {
    const employee = await prisma.employee.findUnique({
      where: { email },
      include: {
        transactions: true,
        sales: true,
      },
    });
    return employee;
  }

  async create({ name, email, phone, address, role, login, senha }: IEmployee) {
    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        phone,
        address,
        role,
        login,
        senha,
      },
    });
    return employee;
  }

  async update(
    id: string,
    { name, email, phone, address, role, login, senha }: IEmployee
  ) {
    const employee = await prisma.employee.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        role,
        login,
        senha,
      },
    });
    return employee;
  }

  async delete(id: string) {
    const employee = await prisma.employee.delete({
      where: { id },
    });
    return employee;
  }
}

export default new EmployeeRepository();
