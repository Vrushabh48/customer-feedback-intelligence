import { Request, Response } from "express";
import { forgotPassword, login, logout, logoutAll, refresh, resetPassword, signup, verifyEmail } from "./auth-functions.js";
import { prisma } from "../../../lib/client.js";
import bcrypt from 'bcrypt'
import { loginSchema, passwordSchema, signupSchema } from "../validation/auth-validation.js";
import { sendEmailVerification } from "../../utils/sendMail.js";

export async function signupController(req: Request, res: Response) {
  const { email, password } = req.body;

  const parsed = signupSchema.safeParse(req.body);

  if(!parsed.success){
    return res.status(400).json({message: "Invalid Input data"})
  }

  try {
  await signup(email, password);
  res.status(201).json({ message: "Account created Successfully. Please Verify your email." });
} catch (err: any) {
  if (err.code === "P2002") {
    return res.status(409).json({ message: "Email already registered" });
  }
  return res.status(500).json({ message: "Signup failed" });
}
}

export async function loginController(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const { accessToken, refreshToken } = await login({
      email: parsed.data.email,
      password: parsed.data.password,
      userAgent: req.headers["user-agent"] ?? "unknown",
      ip: req.ip!
    });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/auth/refresh",
        maxAge: 30 * 24 * 60 * 60 * 1000
      })
      .json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
}

export async function refreshController(req: Request, res: Response) {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
  const { accessToken, refreshToken } = await refresh(token, req.ip!);
  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/auth/refresh",
      maxAge: 30 * 24 * 60 * 60 * 1000
    })
    .json({ accessToken }); //only sending in testing environment
} catch {
  res.clearCookie("refreshToken", { path: "/auth/refresh" });
  return res.sendStatus(401);
}
}

export async function logoutController(req: Request, res: Response) {
  const sessionId = req.user!.sid; //get session Id
  await logout(sessionId);

  res.clearCookie("refreshToken", { path: "/auth/refresh" });
  res.sendStatus(204);
}

export async function logoutAllController(req: Request, res: Response) {
  await logoutAll(req.user!.sub);
  res.clearCookie("refreshToken", { path: "/auth/refresh" });
  res.sendStatus(204);
}

export async function forgotPasswordController(req: Request, res: Response) {
  const { email } = req.body;
   const user = await prisma.user.findUnique({ where: { email } });

  // Enumeration protection
  if (!user) return;
  const userId = user.id;

  await forgotPassword(userId);

  // Always same response (prevents email enumeration)
  res.json({ message: "If email exists, you will get a reset link." });
}

export async function resetPasswordController(req: Request, res: Response) {
  const { token, password } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Invalid request" });
  }
  const parsed = passwordSchema.safeParse(password);

  if (!parsed.success) {
  return res.status(400).json({
    errors: parsed.error.flatten().fieldErrors
  });
}

  await resetPassword(token, password);
  res.json({ message: "Password updated" });
}

export async function verifyEmailController(req: Request, res: Response) {
  const { token } = req.body;
  await verifyEmail(token);
  res.json({ message: "Email verified" });
}