export interface ISoldItem {
  id?: string;
  saleId: string;
  productId: string;
  qtd: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}
