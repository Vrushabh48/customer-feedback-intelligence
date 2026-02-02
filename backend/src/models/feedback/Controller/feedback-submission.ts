import { Request, Response } from "express";
import { submitFeedbackSchema } from "../Validator/feedback.validation.js";
import { FeedbackSubmissionService } from "../Services/feedback-submission.js";

export class FeedbackSubmissionController {
  static async submit(req: Request, res: Response) {
    const parsed = submitFeedbackSchema.parse(req.body);

    const formId = req.params.formId as string;

    await FeedbackSubmissionService.submitFeedback(
      formId,
      parsed.responses,
      {
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip
      }
    );

    res.status(201).json({ success: true });
  }
}
