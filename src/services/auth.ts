import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UsersRepository from "../repositories/UserRepository";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret";

export const validadeCredentials = async (
  password: string,
  emailAdmin: string
): Promise<boolean> => {
  const user = await UsersRepository.findByEmail(emailAdmin);
  if (!user) {
    return false;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid;
};

export const generateToken = (emailAdmin: string) => {
  const payload = { emailAdmin };
  const options = { expiresIn: "15m" };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const generateRefreshToken = (emailAdmin: string) => {
  const payload = { emailAdmin };
  const options = { expiresIn: "7d" }; // Refresh token expires in 7 days
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, options);
};

export const validateToken = (token: string): boolean => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return !!decoded;
  } catch (err) {
    return false;
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
      username: string;
    };
    return generateToken(decoded.username);
  } catch (err) {
    return null;
  }
};
