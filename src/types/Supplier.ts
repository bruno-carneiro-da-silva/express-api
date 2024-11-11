export interface ISupplier {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  address: string;
  cnpj: string;
  city: string;
  photo: string;
  startContractDate: Date;
  endContractDate: Date;
  phone: string;
  corporateReason: string;
  email: string;
  lastName: string;
  dateOfBirth?: Date;
  nationality?: string;
  niche: string;
}
