export interface IContact {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  zip: string;
  birthday: string;
  companyId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
