import { Request, Response } from "express";
import { ProfileService } from "../services/profile.service.js";
import { profileSchema } from "../validator/validator.js";

export class ProfileController {
  /**
   * Create or update profile
   */
  static async upsert(req: Request, res: Response) {
    const parsed = profileSchema.parse(req.body);

    const userId = String(req.user!.sub); // SINGLE source of truth

    const {name, logoURL, role, companyName, industry} = parsed;
    const profile = await ProfileService.upsertProfile(
      userId,
      name!,
      logoURL!,
      role!,
      companyName!,
      industry!
    );

    res.status(200).json(profile);
  }

  /**
   * Get current user's profile
   */
  static async get(req: Request, res: Response) {
    const userId = String(req.user!.sub);

    const profile = await ProfileService.getProfile(userId);

    if (!profile) {
      return res.status(404).json({
        error: "Profile not found"
      });
    }

    res.json(profile);
  }
}
