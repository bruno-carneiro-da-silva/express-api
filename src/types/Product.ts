export interface IProduct {
  id?: string;
  name: string;
  qtd: number;
  price: number;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
