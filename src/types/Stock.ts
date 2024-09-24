export interface IStock {
  id?: string;
  productId: string;
  capacity: number;
  qtd: number;
  minStock: number;
  createdAt?: Date;
  updatedAt?: Date;
}
