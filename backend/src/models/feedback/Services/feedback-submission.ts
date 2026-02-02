import { prisma } from "../../../../lib/client.js";

export class FeedbackSubmissionService {
  static async submitFeedback(
    formId: string,
    responses: { fieldId: string; value: string }[],
    meta: { userAgent?: string; ipAddress?: string }
  ) {
    return prisma.$transaction(async (tx) => {
      const feedback = await tx.feedback.create({
        data: {
          formId,
          userAgent: meta.userAgent,
          ipAddress: meta.ipAddress
        }
      });

      const validFields = await tx.feedbackFormField.findMany({
        where: {
          formId,
          isActive: true
        }
      });

      const fieldMap = new Map(validFields.map(f => [f.id, f]));

      for (const response of responses) {
        const field = fieldMap.get(response.fieldId);

        if (!field) {
          throw new Error("Invalid field in submission");
        }

        if (field.required && !response.value.trim()) {
          throw new Error(`Field "${field.label}" is required`);
        }
      }

      await tx.feedbackResponse.createMany({
        data: responses.map(r => ({
          feedbackId: feedback.id,
          fieldId: r.fieldId,
          value: r.value
        }))
      });

      return { success: true };
    });
  }
}
