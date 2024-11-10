export type EmployeeSelect = {
  id: boolean;
  name: boolean;
  email: boolean;
  phone: boolean;
  address: boolean;
  roleId: boolean;
  userName: boolean;
  password: boolean;
  createdAt: boolean;
  updatedAt: boolean;
};

export type SaleCompanySelect = {
  id: boolean;
  emailAdmin: boolean;
  phoneNumberAdmin: boolean;
  password: boolean;
  nameCompany: boolean;
  emailCompany: boolean;
  phoneNumberCompany: boolean;
  addressCompany: boolean;
  photo_base64: boolean;
  terms: boolean;
  refreshToken: boolean;
  verificationCode: boolean;
  verificationCodeExpiresAt: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  planId: boolean;
  roleId: boolean;
};

export type CompanySelect = {
  id: boolean;
  firstName: boolean;
  lastName: boolean;
  emailAdmin: boolean;
  phoneNumberAdmin: boolean;
  nameCompany: boolean;
  emailCompany: boolean;
  phoneNumberCompany: boolean;
  addressCompany: boolean;
  terms: boolean;
  role: {
    select: {
      name: boolean;
    };
  };
  createdAt: boolean;
  updatedAt: boolean;
  planId: boolean;
  password: boolean;
  refreshToken: boolean;
  verificationCode: boolean;
  verificationCodeExpiresAt: boolean;
  photo_base64: boolean;
  _count: {
    select: {
      contacts: boolean;
      suppliers: boolean;
    };
  };
};

export type ProductSelect = {
  category: boolean;
  stock: boolean;
  soldItems: boolean;
  transactions: boolean;
  photos: boolean;
};

export const employeeSelect: EmployeeSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  address: false,
  roleId: false,
  userName: true,
  password: false,
  createdAt: false,
  updatedAt: false,
};

export const saleCompanySelect: SaleCompanySelect = {
  id: true,
  emailAdmin: true,
  phoneNumberAdmin: true,
  password: false,
  nameCompany: false,
  emailCompany: false,
  phoneNumberCompany: false,
  addressCompany: false,
  photo_base64: false,
  terms: false,
  refreshToken: false,
  verificationCode: false,
  verificationCodeExpiresAt: false,
  createdAt: false,
  updatedAt: false,
  planId: false,
  roleId: false,
};

export const companySelect: CompanySelect = {
  id: true,
  firstName: true,
  lastName: true,
  emailAdmin: true,
  phoneNumberAdmin: true,
  nameCompany: true,
  emailCompany: true,
  phoneNumberCompany: true,
  addressCompany: true,
  terms: true,
  role: {
    select: {
      name: true,
    },
  },
  createdAt: true,
  updatedAt: true,
  planId: true,
  password: false,
  refreshToken: true,
  verificationCode: false,
  verificationCodeExpiresAt: false,
  photo_base64: true,
  _count: {
    select: { contacts: true, suppliers: true },
  },
};

export const productSelect: ProductSelect = {
  category: true,
  stock: true,
  soldItems: true,
  transactions: true,
  photos: true,
};
