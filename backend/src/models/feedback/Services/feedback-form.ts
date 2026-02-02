import { prisma } from "../../../../lib/client.js";
import crypto from "crypto";
import { generateSlug } from "../../../utils/slug.js";

export class FeedbackFormService {
  static async createForm(ownerId: string, data: any) {
    const token = crypto.randomBytes(32).toString("hex");
    const slug = generateSlug(data.title);

    return prisma.$transaction(async (tx) => {
      const form = await tx.feedbackForm.create({
        data: {
          ownerId,
          title: data.title,
          description: data.description,
          slug,
          token,
          allowAnon: data.allowAnon ?? true,
          fields: {
            create: data.fields.map((field: any) => ({
              type: field.type,
              label: field.label,
              required: field.required ?? false,
              order: field.order
            }))
          }
        },
        include: {
          fields: true
        }
      });

      return {
        id: form.id,
        slug: form.slug,
        shareableUrl: `/f/${form.slug}?token=${form.token}`
      };
    });
  }

  static async getFormBySlug(slug: string, token: string) {
    const form = await prisma.feedbackForm.findFirst({
      where: {
        slug,
        token,
        isActive: true
      },
      include: {
        fields: {
          where: { isActive: true },
          orderBy: { order: "asc" }
        }
      }
    });

    if (!form) {
      throw new Error("Form not found or inactive");
    }

    return form;
  }
}
