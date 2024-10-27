export interface IRole {
  id?: number;
  uId?: string;
  name: string;
  permissions: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
