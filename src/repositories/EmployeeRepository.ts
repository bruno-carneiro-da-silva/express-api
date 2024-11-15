import { Prisma, PrismaClient } from "@prisma/client";
import { IEmployee } from "../types/Employee";
import bcrypt from "bcrypt";
import { employeeSelect } from "../utils/selectors";

const prisma = new PrismaClient();

class EmployeeRepository {
  async findAll(orderBy = "ASC", page: number, limit: number, filter: string, companyId: string) {
    const direction = orderBy.toUpperCase() === "DESC" ? "desc" : "asc";

    const skip = (page - 1) * limit;
    let where: Prisma.EmployeeWhereInput = filter
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
    const employee = await prisma.employee.findUnique({
      where: { id: id },
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
    companyId,
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
        companyId,
      },
    });
    const { password: _, ...employeeWithoutPassword } = employee;
    return employeeWithoutPassword;
  }

  async update(
    id: string,
    { name, email, phone, address, roleId, userName, password, companyId }: IEmployee
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
        companyId,
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
