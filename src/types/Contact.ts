export interface IContact {
  id?: string;
  name: string;
  email: string;
  phone: string;
  companyId: string;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
