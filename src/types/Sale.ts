import { PaymentStatus } from "@prisma/client";

export interface ISale {
  employeeId: string;
  companyId: string;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  discount?: number;
  soldItems: {
    productId: string;
    qtd: number;
    price: number;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}
