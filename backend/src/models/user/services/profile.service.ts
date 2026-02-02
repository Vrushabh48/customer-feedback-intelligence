import { prisma } from "../../../../lib/client.js";

export class ProfileService {
  /**
   * Create or update profile (idempotent)
   */
  static async upsertProfile(userId: string, name: string, logoURL: string, role: string, companyName: string, industry: string) {
    return prisma.profile.update({
      where: {
        userId
      },
      data: {
        userId,
        name,
        logoURL,
        role,
        companyName,
        industry
      },
    });
  }

  /**
   * Fetch current user's profile
   */
  static async getProfile(userId: string) {
    return prisma.profile.findUnique({
      where: { userId }
    });
  }
}