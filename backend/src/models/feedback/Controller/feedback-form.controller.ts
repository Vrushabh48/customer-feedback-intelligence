import { Request, Response } from "express";
import { createFeedbackFormSchema } from "../Validator/feedback.validation.js";
import { FeedbackFormService } from "../Services/feedback-form.js";

export class FeedbackFormController {
  static async create(req: Request, res: Response) {
    const parsed = createFeedbackFormSchema.parse(req.body);

    const result = await FeedbackFormService.createForm(
      req.user!.sub,
      parsed
    );

    res.status(201).json(result);
  }

  static async getPublicForm(req: Request, res: Response) {
    const slug = req.params.slug as string;
    const { token } = req.query as { token: string };

    if (!slug) {
    return res.status(400).json({
      error: "Missing form slug"
    });
  }

    const form = await FeedbackFormService.getFormBySlug(slug, token);

    res.json({
      id: form.id,
      title: form.title,
      description: form.description,
      fields: form.fields
    });
  }
}
