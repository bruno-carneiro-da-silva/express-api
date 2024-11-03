export interface ICompany {
  id?: string;
  firstName: string;
  lastName: string;
  emailAdmin: string;
  phoneNumberAdmin: string;
  nameCompany: string;
  emailCompany: string;
  phoneNumberCompany: string;
  addressCompany: string;
  terms?: boolean;
  username?: string;
  password: string;
  role?: string[];
  planId?: string;
  photo?: string
  createdAt?: Date;
  updatedAt?: Date;
}
