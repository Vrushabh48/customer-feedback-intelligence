import { prisma } from "../../lib/client.js";
import { generateToken, hashToken } from "./crypto.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const FRONTEND_URL = process.env.FRONTEND_URL!;

export async function sendEmailVerification(userId: string, email: string) {
  const token = generateToken();
  const tokenHash = hashToken(token);

  await prisma.emailToken.create({
    data: {
      userId,
      type: "VERIFY_EMAIL",
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000)
    }
  });

  const verifyUrl = `${FRONTEND_URL}/verify-email?token=${encodeURIComponent(
    token
  )}`;

  const { error } = await resend.emails.send({
    from: "Vrushabh <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email",
    html: `
      <p>Welcome!</p>
      <p>Please verify your email by clicking the link below:</p>
      <p><a href="${verifyUrl}">Verify Email</a></p>
      <p>This link expires in 1 hour.</p>
    `
  });

  if (error) {
    throw new Error("Failed to send verification email");
  }
}