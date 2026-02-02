import { z } from "zod";

export const createFeedbackFormSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  allowAnon: z.boolean().optional(),
  fields: z.array(
    z.object({
      type: z.enum(["TEXT", "RATING", "EMAIL", "NAME"]),
      label: z.string().min(1),
      required: z.boolean().optional(),
      order: z.number().int().min(0)
    })
  ).min(1)
});

export const submitFeedbackSchema = z.object({
  responses: z.array(
    z.object({
      fieldId: z.string().cuid(),
      value: z.string().min(1)
    })
  ).min(1)
});
