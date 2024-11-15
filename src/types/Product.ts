export interface IProduct {
  id?: string;
  name: string;
  description: string;
  minStock?: number;
  photos: string[];
  // size: string;
  qtd: number;
  price: number;
  categoryId: string;
  companyId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
