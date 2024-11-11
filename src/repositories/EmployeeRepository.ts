import { Prisma, PrismaClient } from "@prisma/client";
import { IEmployee } from "../types/Employee";
import bcrypt from "bcrypt";
import { employeeSelect } from "../utils/selectors";

const prisma = new PrismaClient();

class EmployeeRepository {
  async findAll(orderBy = "ASC", page: number, limit: number, filter: string) {
    const direction = orderBy.toUpperCase() === "DESC" ? "desc" : "asc";

    const skip = (page - 1) * limit;
    const where: Prisma.EmployeeWhereInput | undefined = filter
      ? ({
          OR: [
            { name: { contains: filter, mode: "insensitive" } },
            { email: { contains: filter, mode: "insensitive" } },
            { phone: { contains: filter, mode: "insensitive" } },
            { address: { contains: filter, mode: "insensitive" } },
          ],
        } as const)
      : undefined;

    const employees = await prisma.employee.findMany({
      where,
      orderBy: {
        name: direction,
      },
      select: employeeSelect,
      skip,
      take: limit,
    });

    const total = await prisma.employee.count({ where });

    return { employees, total };
  }

  async findById(id: string) {
    console.log(`Procurando funcionário com id: ${id}`); // Log para depuração

    const employee = await prisma.employee.findUnique({
      where: { id: id },
      select: employeeSelect,
    });
    console.log(`Funcionário encontrado: ${employee}`); // Log para depuração
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
