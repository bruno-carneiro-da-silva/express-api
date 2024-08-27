export interface ISale {
  employeeId: string;
  userId: string;
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
