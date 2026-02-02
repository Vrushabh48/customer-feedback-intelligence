import bcrypt from "bcrypt";
import { prisma } from '../../../lib/client.js'
import { signAccessToken } from "../../utils/jwt.js";
import { generateToken, hashToken } from "../../utils/crypto.js";
import { sendEmailVerification } from "../../utils/sendMail.js";
import { Resend } from "resend";

//signup function
export async function signup(email: string, password: string) {
  try {
  const passwordHash = await bcrypt.hash(password, 12);
  
    const user = await prisma.user.create({
      data: { email, passwordHash }
    });

    //creating user profile during signup
    const profile = await prisma.profile.create({
      data: { userId: user.id }
    });
  
    //sending email for email verification
    await sendEmailVerification(user.id, user.email);
} catch (err: any) {
  throw err;
}
}

//login function
export async function login({
  email,
  password,
  userAgent,
  ip
}: {
  email: string;
  password: string;
  userAgent: string;
  ip: string;
}) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  // Optional policy
  // if (!user.emailVerified) throw new Error("EMAIL_NOT_VERIFIED");

  const refreshToken = generateToken();
  const refreshTokenHash = hashToken(refreshToken);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshTokenHash,
      userAgent,
      ipAddress: ip,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });

  const accessToken = signAccessToken({
    sub: user.id,
    sid: session.id
  });

  return { accessToken, refreshToken };
}

//update the refreshToken
export async function refresh(oldToken: string, ip: string) {
  const tokenHash = hashToken(oldToken);

  // Find the existing session
  const session = await prisma.session.findFirst({
    where: {
      refreshTokenHash: tokenHash,
      isRevoked: false
    }
  });

  if (!session || session.expiresAt < new Date()) {
    throw new Error("Invalid refresh token");
  }

  // Generate new refresh token
  const newRefreshToken = generateToken();
  const newRefreshTokenHash = hashToken(newRefreshToken);

  // Atomic rotation:
  // 1. Revoke old session
  // 2. Create new session
  const [, newSession] = await prisma.$transaction([
    prisma.session.update({
      where: { id: session.id },
      data: { isRevoked: true }
    }),
    prisma.session.create({
      data: {
        userId: session.userId,
        refreshTokenHash: newRefreshTokenHash,
        userAgent: session.userAgent,
        ipAddress: ip,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    })
  ]);

  const accessToken = signAccessToken({
    sub: newSession.userId,
    sid: newSession.id
  });

  return {
    accessToken,
    refreshToken: newRefreshToken
  };
}

//logout from the current device
export async function logout(sessionId: string) {
  await prisma.session.update({
    where: { id: sessionId },
    data: { isRevoked: true }
  });
}

//logout from all the devices
export async function logoutAll(userId: string) {
  await prisma.session.updateMany({
    where: { userId },
    data: { isRevoked: true }
  });
}

export async function forgotPassword(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  // Enumeration protection (do nothing visibly)
  if (!user) return;

  const now = new Date();
  const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

  // 1. Rate limiting: check last RESET_PASSWORD token
  const lastToken = await prisma.emailToken.findFirst({
    where: {
      userId,
      type: "RESET_PASSWORD"
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  if (
    lastToken &&
    now.getTime() - lastToken.createdAt.getTime() < RATE_LIMIT_WINDOW
  ) {
    // Silently return (do NOT throw, prevents probing)
    return;
  }

  // 2. Invalidate ALL existing RESET_PASSWORD tokens
  await prisma.emailToken.updateMany({
    where: {
      userId,
      type: "RESET_PASSWORD",
      used: false
    },
    data: {
      used: true
    }
  });

  // 3. Generate new token
  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);

  await prisma.emailToken.create({
    data: {
      userId,
      type: "RESET_PASSWORD",
      tokenHash,
      expiresAt: new Date(now.getTime() + RATE_LIMIT_WINDOW)
    }
  });

  // 4. Send reset email
  const resend = new Resend(process.env.RESEND_API_KEY!);

  const resetUrl = `http://localhost:5173/reset-password?token=${encodeURIComponent(
    rawToken
  )}`;

  const { error } = await resend.emails.send({
    from: "Vrushabh <onboarding@resend.dev>",
    to: user.email,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>This link expires in 15 minutes.</p>
      <p>If you did not request this, ignore this email.</p>
    `
  });

  if (error) {
    // Optional: mark token used if email fails
    await prisma.emailToken.updateMany({
      where: {
        userId,
        type: "RESET_PASSWORD",
        used: false
      },
      data: { used: true }
    });

    throw new Error("Failed to send reset password email");
  }
}

//reset the password and set the token as 'used'
export async function resetPassword(token: string, newPassword: string) {
  const tokenHash = hashToken(token);

  const record = await prisma.emailToken.findFirst({
    where: {
      tokenHash,
      type: "RESET_PASSWORD",
      used: false,
      expiresAt: { gt: new Date() }
    }
  });

  if (!record) {
    throw new Error("Invalid token");
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash }
    }),

    prisma.emailToken.update({
      where: { id: record.id },
      data: { used: true }
    }),

    prisma.session.updateMany({
      where: { userId: record.userId },
      data: { isRevoked: true }
    })
  ]);
}

//function to verify email sent during signup
export async function verifyEmail(rawToken: string) {
  if (!rawToken) {
    throw new Error("Verification token missing");
  }

  const tokenHash = hashToken(rawToken);

  const tokenRecord = await prisma.emailToken.findFirst({
    where: {
      tokenHash,
      type: "VERIFY_EMAIL",
      used: false,
      expiresAt: { gt: new Date() }
    },
    include: { user: true }
  });

  if (!tokenRecord) {
    throw new Error("Invalid or expired verification token");
  }

  // Atomic transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { emailVerified: true }
    }),
    prisma.emailToken.update({
      where: { id: tokenRecord.id },
      data: { used: true }
    })
  ]);
}