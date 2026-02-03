import { Request, Response } from "express";
import { FeedbackResponseService } from "../Services/feedback-requests.services.js";

export const getFormResponses = async (req: Request<{ formId: string }>, res: Response) => {
  try {
    const { formId } = req.params;

    if (!formId) {
      return res.status(400).json({
        message: "formId is required",
      });
    }

    const responses =
      await FeedbackResponseService.getResponsesByFormId(formId);

    return res.status(200).json({
      data: responses,
    });
  } catch (error) {
    console.error("GET FORM RESPONSES ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch responses",
    });
  }
};
