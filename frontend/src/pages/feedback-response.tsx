import { useMemo, useState } from "react";

type FieldType = "text" | "multiline" | "rating" | "email";

type FormField = {
  id: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  required?: boolean;
  order?: number;
};

type FeedbackForm = {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
};

type LoadState =
  | { status: "loading" }
  | { status: "success"; form: FeedbackForm }
  | { status: "error"; message: string };

const normalizeForm = (data: unknown): FeedbackForm => {
  if (!data || typeof data !== "object") {
    return {
      id: "demo-form",
      title: "Customer Feedback",
      description: "Help us improve by sharing your experience.",
      fields: [
        {
          id: "q1",
          label: "How satisfied are you with the product?",
          type: "rating",
        },
        {
          id: "q2",
          label: "What is one thing we should improve?",
          type: "multiline",
          placeholder: "Share your thoughts...",
        },
        {
          id: "q3",
          label: "Any additional comments?",
          type: "text",
        },
      ],
    };
  }

  const record = data as Record<string, unknown>;
  const fields = Array.isArray(record.fields) ? record.fields : [];

  const mapFieldType = (value: unknown): FieldType => {
    const raw = String(value ?? "").toLowerCase();
    if (raw === "rating") return "rating";
    if (raw === "multiline" || raw === "textarea") return "multiline";
    if (raw === "email") return "email";
    return "text";
  };

  return {
    id: String(record.id ?? "feedback-form"),
    title: String(record.title ?? "Customer Feedback"),
    description: record.description ? String(record.description) : undefined,
    fields: fields
      .map((field) => {
        if (!field || typeof field !== "object") return null;
        const item = field as Record<string, unknown>;
        return {
          id: String(item.id ?? Math.random().toString(36).slice(2, 9)),
          label: String(item.label ?? "New question"),
          type: mapFieldType(item.type),
          placeholder: item.placeholder ? String(item.placeholder) : undefined,
          required: Boolean(item.required),
          order: typeof item.order === "number" ? item.order : undefined,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0)) as FormField[],
  };
};

export default function FeedbackResponse() {
  const [loadState] = useState<LoadState>({
    status: "success",
    form: normalizeForm({
      id: "cml5gd5m200017kvwoumoxrbc",
      title: "Checkout Feedback",
      description: "Tell us about your checkout experience",
      fields: [
        {
          id: "cml5gd5rj00027kvwr7e7yna4",
          formId: "cml5gd5m200017kvwoumoxrbc",
          type: "TEXT",
          label: "What went wrong?",
          required: true,
          order: 0,
          createdAt: "2026-02-02T17:37:37.706Z",
          isActive: true,
        },
        {
          id: "cml5gd5rj00037kvwqui3gq2g",
          formId: "cml5gd5m200017kvwoumoxrbc",
          type: "RATING",
          label: "How bad was it? (1–5)",
          required: true,
          order: 1,
          createdAt: "2026-02-02T17:37:37.706Z",
          isActive: true,
        },
        {
          id: "cml5gd5rj00047kvwe3885m2y",
          formId: "cml5gd5m200017kvwoumoxrbc",
          type: "EMAIL",
          label: "Your email (optional)",
          required: false,
          order: 2,
          createdAt: "2026-02-02T17:37:37.706Z",
          isActive: true,
        },
      ],
    }),
  });
  const [responses, setResponses] = useState<Record<string, string>>(() =>
    loadState.status === "success"
      ? loadState.form.fields.reduce<Record<string, string>>((acc, field) => {
          acc[field.id] = "";
          return acc;
        }, {})
      : {}
  );
  const [submitState, setSubmitState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleResponseChange = (fieldId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
  };

  const completion = useMemo(() => {
    if (loadState.status !== "success") return 0;
    const total = loadState.form.fields.length || 1;
    const filled = loadState.form.fields.filter(
      (field) => responses[field.id]?.trim().length,
    ).length;
    return Math.round((filled / total) * 100);
  }, [loadState, responses]);

  const handleSubmit = async () => {
    if (loadState.status !== "success") return;
    setSubmitState("submitting");

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSubmitState("success");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      setSubmitState("error");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100">
      <div className="mx-auto w-full max-w-3xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        {loadState.status === "loading" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
            <div className="mt-4 h-6 w-2/3 animate-pulse rounded-full bg-slate-200" />
            <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-slate-200" />
            <div className="mt-6 space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          </div>
        )}

        {loadState.status === "error" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-slate-600">{loadState.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              Try Again
            </button>
          </div>
        )}

        {loadState.status === "success" && (
          <div className="space-y-6">
            <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Feedback Form
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
                {loadState.form.title}
              </h1>
              {loadState.form.description && (
                <p className="mt-3 text-sm text-slate-600">
                  {loadState.form.description}
                </p>
              )}
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Estimated time: 2-3 minutes
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Completion</span>
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-900 transition-all"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{completion}%</span>
                </div>
              </div>
            </header>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-5">
                {loadState.form.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          Question {index + 1}
                        </p>
                        <p className="mt-2 text-sm font-medium text-slate-900">
                          {field.label}
                          {field.required && (
                            <span className="ml-1 text-slate-400">*</span>
                          )}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                        {(field.type ?? "text") === "rating"
                          ? "Rating"
                          : (field.type ?? "text") === "multiline"
                          ? "Long answer"
                          : (field.type ?? "text") === "email"
                          ? "Email"
                          : "Short answer"}
                      </span>
                    </div>

                    <div className="mt-4">
                      {field.type === "multiline" ? (
                        <textarea
                          rows={4}
                          value={responses[field.id] ?? ""}
                          onChange={(event) =>
                            handleResponseChange(field.id, event.target.value)
                          }
                          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                          placeholder={
                            field.placeholder ?? "Type your response"
                          }
                        />
                      ) : field.type === "rating" ? (
                        <div className="flex flex-wrap gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() =>
                                handleResponseChange(
                                  field.id,
                                  rating.toString(),
                                )
                              }
                              className={`h-10 w-10 rounded-full border text-sm font-medium transition ${
                                responses[field.id] === rating.toString()
                                  ? "border-slate-900 bg-slate-900 text-white"
                                  : "border-slate-200 text-slate-600 hover:border-slate-300"
                              }`}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input
                          type={field.type === "email" ? "email" : "text"}
                          value={responses[field.id] ?? ""}
                          onChange={(event) =>
                            handleResponseChange(field.id, event.target.value)
                          }
                          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                          placeholder={
                            field.placeholder ?? "Type your response"
                          }
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Your responses are private and reviewed by the product team.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {submitState === "success" && (
                  <span className="text-xs font-medium text-emerald-600">
                    Response submitted. Thank you!
                  </span>
                )}
                {submitState === "error" && (
                  <span className="text-xs font-medium text-rose-600">
                    Could not submit. Please try again.
                  </span>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={submitState === "submitting"}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitState === "submitting"
                    ? "Submitting..."
                    : "Submit Response"}
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
