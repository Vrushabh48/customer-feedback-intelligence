import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;

export function authGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);
  if (!header?.startsWith("Bearer ")) {
  return res.sendStatus(401);
}
  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, ACCESS_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    return res.sendStatus(401);
  }
}
