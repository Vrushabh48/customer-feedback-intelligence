import { useState } from "react";

type Field = {
  id: string;
  label: string;
};

const createId = () => `field_${Math.random().toString(36).slice(2, 9)}`;

export default function CreateForm() {
  const [formTitle, setFormTitle] = useState("New Feedback Form");
  const [fields, setFields] = useState<Field[]>([
    { id: createId(), label: "How would you rate your experience?" },
  ]);

  const addField = () => {
    setFields((prev) => [
      ...prev,
      { id: createId(), label: "New question" },
    ]);
  };

  const updateField = (id: string, value: string) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, label: value } : field
      )
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100">
      <div className="mx-auto w-full max-w-4xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Feedback Builder
            </p>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Create New Form
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Add questions, update the title, and publish when you are ready.
            </p>
          </div>
          <button className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900">
            Save Draft
          </button>
        </header>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Form Title
          </label>
          <input
            value={formTitle}
            onChange={(event) => setFormTitle(event.target.value)}
            className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base font-medium text-slate-900 outline-none transition focus:border-slate-300"
            placeholder="Enter feedback form name"
          />
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Feedback Questions
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Add questions to capture customer insights.
              </p>
            </div>
            <button
              onClick={addField}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Add New Field
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Question {index + 1}
                    </p>
                    <input
                      value={field.label}
                      onChange={(event) =>
                        updateField(field.id, event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-300"
                      placeholder="Enter your question"
                    />
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                    Short answer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Fields are saved automatically while you edit.
          </p>
          <button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800">
            Submit Feedback Form
          </button>
        </section>
      </div>
    </div>
  );
}
