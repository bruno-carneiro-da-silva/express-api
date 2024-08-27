import { RequestHandler } from "express";
import EmployeeRepository from "../repositories/EmployeeRepository";

export const index: RequestHandler = async (request, response) => {
  try {
    const employees = await EmployeeRepository.findAll();
    response.json(employees);
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
};

export const show: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const employee = await EmployeeRepository.findById(id);
    if (!employee) {
      return response.status(404).json({ error: "Employee not found" });
    }
    response.json(employee);
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
};

export const store: RequestHandler = async (request, response) => {
  try {
    const { name, email, phone, address, role, login, senha } = request.body;
    if (!name || !email || !phone || !address || !role || !login || !senha) {
      return response.status(400).json({ error: "All fields are required" });
    }
    const newEmployee = await EmployeeRepository.create({
      name,
      email,
      phone,
      address,
      role,
      login,
      senha,
    });
    response.status(201).json(newEmployee);
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
};

export const update: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const { name, email, phone, address, role, login, senha } = request.body;
    const updatedEmployee = await EmployeeRepository.update(id, {
      name,
      email,
      phone,
      address,
      role,
      login,
      senha,
    });
    if (!updatedEmployee) {
      return response.status(404).json({ error: "Employee not found" });
    }
    response.json(updatedEmployee);
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteEmployee: RequestHandler = async (request, response) => {
  try {
    const { id } = request.params;
    const deletedEmployee = await EmployeeRepository.delete(id);
    if (!deletedEmployee) {
      return response.status(404).json({ error: "Employee not found" });
    }
    response.json({ message: "Employee deleted successfully" });
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
};
