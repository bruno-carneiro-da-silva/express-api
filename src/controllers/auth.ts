import { RequestHandler } from "express";
import { z } from "zod";
import * as auth from "../services/auth";
import UsersRepository from "../repositories/UserRepository";
import bcrypt from "bcrypt";

export const login: RequestHandler = async (req, res) => {
  const loginSchema = z.object({
    username: z.string(),
    password: z.string().min(8),
  });
  const body = loginSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Dados inválidos" });

  const user = await UsersRepository.findByUsername(body.data.username);
  if (!user) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  const isPasswordValid = await bcrypt.compare(
    body.data.password,
    user.password
  );
  if (!isPasswordValid) {
    return res.status(403).json({ error: "Acesso negado" });
  }


  const refreshToken = auth.generateRefreshToken(body.data.username);
  await UsersRepository.updateRefreshToken(user.id, refreshToken);

  res.json({
    accessToken: auth.generateToken(body.data.username),
  });
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
