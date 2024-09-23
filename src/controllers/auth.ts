import { RequestHandler } from "express";
import { z } from "zod";
import * as auth from "../services/auth";
import UsersRepository from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import { sendEmail } from "../services/twilio";

export const login: RequestHandler = async (req, res) => {
  const loginSchema = z.object({
    phoneNumberAdmin: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, { message: "Número de telefone inválido" }),
    password: z.string().min(8),
  });
  const body = loginSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Dados inválidos" });

  const user = await UsersRepository.findByPhoneNumber(
    body.data.phoneNumberAdmin
  );

  if (!user) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  const isPasswordValid = await bcrypt.compare(
    body.data.password,
    user.password
  );

  console.log(isPasswordValid);
  if (!isPasswordValid) {
    return res.status(403).json({ error: "Senha inválida, digite novamente" });
  }

  const refreshToken = auth.generateRefreshToken(body.data.phoneNumberAdmin);
  await UsersRepository.updateRefreshToken(user.id, refreshToken);

  const { password, refreshToken: _, ...userWithoutPassword } = user;

  res.json({
    accessToken: auth.generateToken(body.data.phoneNumberAdmin),
    user: userWithoutPassword,
  });
};

export const sendVerificationCode: RequestHandler = async (req, res) => {
  const schema = z.object({
    emailAdmin: z.string().email({ message: "Email inválido" }),
  });
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Dados inválidos" });

  const user = await UsersRepository.findByEmail(body.data.emailAdmin);
  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

  await UsersRepository.updateVerificationCode(
    user.emailAdmin,
    verificationCode,
    expiresAt
  );

  await sendEmail(
    body.data.emailAdmin,
    "Código de Verificação",
    `Seu código de verificação é: ${verificationCode}`
  );

  res.json({ message: "Código de verificação enviado" });
};

export const verifyCodeAndResetPassword: RequestHandler = async (req, res) => {
  const schema = z.object({
    phoneNumberAdmin: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, { message: "Número de telefone inválido" }),
    code: z.string().length(6),
    newPassword: z.string().min(8),
  });
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Dados inválidos" });

  const user = await UsersRepository.findByPhoneNumber(
    body.data.phoneNumberAdmin
  );
  if (
    !user ||
    user.verificationCode !== body.data.code ||
    !user.verificationCodeExpiresAt ||
    new Date() > user.verificationCodeExpiresAt
  ) {
    return res
      .status(403)
      .json({ error: "Código de verificação inválido ou expirado" });
  }

  const hashedPassword = await bcrypt.hash(body.data.newPassword, 10);
  await UsersRepository.updatePasswordByPhoneNumber(
    body.data.phoneNumberAdmin,
    hashedPassword
  );

  res.json({ message: "Senha redefinida com sucesso" });
};

export const validate: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ error: "Acesso negado" });
  }
  const token = authHeader.split(" ")[1];
  if (!auth.validateToken(token)) {
    const user = await UsersRepository.findByAccessToken(token);
    if (!user || !auth.validateRefreshToken(user?.refreshToken ?? "")) {
      return res.status(403).json({ error: "Acesso negado" });
    }
    const newAccessToken = auth.getNewAccessToken(user?.refreshToken ?? "");
    if (!newAccessToken) {
      return res.status(403).json({ error: "Acesso negado" });
    }
    res.setHeader("Authorization", `Bearer ${newAccessToken}`);
  }
  next();
};

export const refreshToken: RequestHandler = async (req, res) => {
  const refreshTokenSchema = z.object({
    token: z.string(),
  });
  const body = refreshTokenSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Dados inválidos" });

  const user = await UsersRepository.findByRefreshToken(body.data.token);
  if (!user || !auth.validateRefreshToken(body.data.token)) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  const newAccessToken = auth.generateToken(user.emailAdmin);
  res.json({ accessToken: newAccessToken });
};
