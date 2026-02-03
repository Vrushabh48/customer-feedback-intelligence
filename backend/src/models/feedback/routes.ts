import { Router } from "express";
import { FeedbackSubmissionController } from "./Controller/feedback-submission.js";
import { FeedbackFormController } from "./Controller/feedback-form.controller.js";
import { authGuard } from "../../middleware/middleware.js";
import { getFormResponses } from "./Controller/feedback-requests.js";

const router = Router();

router.post("/", authGuard, FeedbackFormController.create);
router.get("/:slug", FeedbackFormController.getPublicForm);


router.post("/:formId/submit", FeedbackSubmissionController.submit);

router.get("/forms/:formId/responses", getFormResponses);

export default router;