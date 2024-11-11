import jwt, { JsonWebTokenError } from "jsonwebtoken";
import bcrypt from "bcrypt";
import CompaniesRepository from "../repositories/CompanyRepository";
import "dotenv/config";

export const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret";
export const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret";

export const validadeCredentials = async (
  password: string,
  emailAdmin: string
): Promise<boolean> => {
  const user = await CompaniesRepository.findByEmail(emailAdmin);
  if (!user) {
    return false;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid;
};

export const generateToken = (userId: string, phoneNumberAdmin: string) => {
  const payload = { userId, phoneNumberAdmin };
  const options = { expiresIn: "15m" };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const generateRefreshToken = (
  userId: string,
  phoneNumberAdmin: string
) => {
  const payload = { userId, phoneNumberAdmin };
  const options = { expiresIn: "7d" };
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, options);
};

export const validateToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, decoded };
  } catch (err: unknown) {
    if (err instanceof JsonWebTokenError && err.name === "TokenExpiredError") {
      return { valid: false, reason: "expired" };
    } else if (err instanceof JsonWebTokenError && err.name === "SyntaxError") {
      return { valid: false, reason: "invalid" };
    }
    return { valid: false, reason: "unknown" };
  }
};

export const validateRefreshToken = (token: string): boolean => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    return !!decoded;
  } catch (err) {
    return false;
  }
};

export const getNewAccessToken = (refreshToken: string): string | null => {
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as {
      userId: string;
      phoneNumberAdmin: string;
    };
    return generateToken(decoded.userId, decoded.phoneNumberAdmin);
  } catch (err) {
    return null;
  }
};
