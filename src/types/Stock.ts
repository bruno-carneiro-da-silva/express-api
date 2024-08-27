export interface IStock {
  id?: string;
  productId: string;
  capacity: number;
  qtd: number;
  createdAt?: Date;
  updatedAt?: Date;
}
