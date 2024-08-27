export interface ITransaction {
  id?: string;
  productId: string;
  employeeId: string;
  supplierCnpj: string;
  qtd: number;
  totalPrice: number;
  selledPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}
