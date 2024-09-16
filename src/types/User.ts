export interface IUser {
  id?: string;
  firstName: string;
  lastName: string;
  emailAdmin: string;
  phoneNumberAdmin: string;
  nameCompany: string;
  emailCompany: string;
  phoneNumberCompany: string;
  addressCompany: string;
  terms: boolean | null;
  username: string;
  password: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}
