import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1).optional(),
  logoURL: z.string().url().optional(),

  role: z.string().min(1).optional(),
  companyName: z.string().min(1).optional(),
  companySize: z.enum([
    "SOLO",
    "SMALL_1_10",
    "SMALL_11_50",
    "MID_51_200",
    "LARGE_200_PLUS"
  ]).optional(),
  industry: z.string().min(1).optional()
});
