import { getDate } from "../utils/getDate";

export const validadeCredentials = (
  password: string,
  email: string
): boolean => {
  const currentPassword = getDate().split("/").join("");
  return password === currentPassword && email === process.env.DEFAULT_EMAIL;
};

export const generateToken = (email: string) => {
  const currentPassword = getDate().split("/").join("");
  return `${process.env.DEFAULT_TOKEN}${currentPassword}${email}`;
};

export const validateToken = (token: string): boolean => {
  const currentToken = generateToken(process.env.DEFAULT_EMAIL || "");
  return token === currentToken;
};
