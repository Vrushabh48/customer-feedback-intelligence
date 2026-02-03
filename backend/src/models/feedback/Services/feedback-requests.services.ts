import { prisma } from "../../../../lib/client.js";

export class FeedbackResponseService {
  static async getResponsesByFormId(formId: string) {
    const feedbacks = await prisma.feedback.findMany({
      where: {
        formId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        responses: {
          include: {
            field: true,
          },
        },
      },
    });

    /**
     * Transform into:
     * Array<Array<{ field, response }>>
     */
    const result = feedbacks.map((feedback) =>
      feedback.responses.map((response) => ({
        field: response.field,
        response,
      }))
    );

    return result;
  }
}