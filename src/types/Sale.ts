export interface ISale {
  employeeId: string;
  companyId: string;
  totalPrice: number;
  discount?: number;
  soldItems: {
    productId: string;
    qtd: number;
    price: number;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}
