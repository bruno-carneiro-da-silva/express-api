export interface ISupplier {
  id?: string;
  name: string;
  address: string;
  cnpj: string;
  phone: string;
  corporateReason: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}
