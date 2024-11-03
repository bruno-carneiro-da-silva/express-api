import { PrismaClient } from "@prisma/client";
import { IEmployee } from "../types/Employee";
import bcrypt from "bcrypt";
import { employeeSelect } from "../utils/selectors";

const prisma = new PrismaClient();

class EmployeeRepository {
  async findAll(orderBy = "ASC") {
    const direction = orderBy.toUpperCase() === "DESC" ? "desc" : "asc";
    const employees = await prisma.employee.findMany({
      orderBy: {
        name: direction,
      },
      select: employeeSelect,
    });
    return employees;
  }

  async findById(id: string) {
    const employee = await prisma.employee.findUnique({
      where: { id },
      select: employeeSelect,
    });
    return employee;
  }

  async findByEmail(email: string) {
    const employee = await prisma.employee.findUnique({
      where: { email },
      select: employeeSelect,
    });
    return employee;
  }

  async create({
    name,
    email,
    phone,
    address,
    roleId,
    userName,
    password,
  }: IEmployee) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        phone,
        address,
        roleId,
        userName,
        password: hashedPassword,
      },
    });
    const { password: _, ...employeeWithoutPassword } = employee;
    return employeeWithoutPassword;
  }

  async update(
    id: string,
    { name, email, phone, address, roleId, userName, password }: IEmployee
  ) {
    const hashedUpdatePassword = await bcrypt.hash(password, 10);
    const employee = await prisma.employee.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        roleId,
        userName,
        password: hashedUpdatePassword,
      },
    });
    const { password: _, ...employeeWithoutPassword } = employee;
    return employeeWithoutPassword;
  }

  async delete(id: string) {
    const employee = await prisma.employee.delete({
      where: { id },
    });
    return employee;
  }
}

export default new EmployeeRepository();
