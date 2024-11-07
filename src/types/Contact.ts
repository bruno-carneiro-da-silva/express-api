export interface IContact {
  id?: string;
  name: string;
  email: string;
  phone: string;
  status?: boolean;
  address: string;
  zip: string;
  birthday: string;
  latitude: string;
  longitude: string;
  companyId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
