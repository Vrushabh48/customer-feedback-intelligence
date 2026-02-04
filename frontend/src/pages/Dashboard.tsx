export default function Dashboard() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100">
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Customer Feedback Intelligence
            </p>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Welcome back, Vrushabh
            </h1>
            <p className="max-w-xl text-sm text-slate-600 sm:text-base">
              Create new feedback forms, monitor responses, and keep a pulse on
              customer sentiment in one place.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900">
              Import Responses
            </button>
            <button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800">
              Create New Form
            </button>
          </div>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Active Forms", value: "8", delta: "+2 this week" },
            { label: "Responses Collected", value: "1,284", delta: "+142" },
            { label: "Avg. Satisfaction", value: "4.6/5", delta: "+0.2" },
            { label: "Open Alerts", value: "3", delta: "2 need review" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                {stat.label}
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-slate-500">{stat.delta}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Create New Feedback Form
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Choose a template or start from scratch.
                  </p>
                </div>
                <button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                  Start Building
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Product Launch Survey",
                    desc: "Measure early sentiment from beta users.",
                  },
                  {
                    title: "NPS Pulse Check",
                    desc: "Track loyalty with a short, repeatable form.",
                  },
                  {
                    title: "Customer Support Follow-up",
                    desc: "Close the loop on resolved tickets.",
                  },
                  {
                    title: "UX Research Sprint",
                    desc: "Collect structured insights from testers.",
                  },
                ].map((template) => (
                  <button
                    key={template.title}
                    className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-300 hover:bg-white"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {template.title}
                      </p>
                      <p className="mt-2 text-xs text-slate-600">
                        {template.desc}
                      </p>
                    </div>
                    <span className="mt-4 text-xs font-medium text-slate-500">
                      Use template
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Previous Forms Created
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Recently edited and shared with customers.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <input
                    type="text"
                    placeholder="Search forms"
                    className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-300"
                  />
                  <button className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
                    Filter
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  {
                    name: "Q1 Product Feedback",
                    status: "Live",
                    responses: 428,
                    updated: "Updated 2 days ago",
                  },
                  {
                    name: "Support Experience Audit",
                    status: "Draft",
                    responses: 0,
                    updated: "Edited yesterday",
                  },
                  {
                    name: "New Pricing Perception",
                    status: "Live",
                    responses: 196,
                    updated: "Updated Feb 1, 2026",
                  },
                ].map((form) => (
                  <div
                    key={form.name}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {form.name}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        {form.updated}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        {form.status}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        {form.responses} responses
                      </span>
                      <button className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
                        View Insights
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Insights Snapshot
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Highlights from the last 7 days.
              </p>
              <div className="mt-6 space-y-4">
                {[
                  {
                    title: "Top theme",
                    detail: "Onboarding clarity (32% mentions)",
                  },
                  {
                    title: "Rising issue",
                    detail: "Mobile load times up by 18%",
                  },
                  {
                    title: "Promoters",
                    detail: "62% of respondents recommend the product",
                  },
                ].map((insight) => (
                  <div
                    key={insight.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {insight.title}
                    </p>
                    <p className="mt-3 text-sm font-medium text-slate-900">
                      {insight.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Scheduled Automations
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Keep feedback collection running in the background.
              </p>
              <div className="mt-6 space-y-4 text-sm text-slate-600">
                {[
                  {
                    name: "Weekly NPS Pulse",
                    schedule: "Every Monday · 9:00 AM",
                  },
                  {
                    name: "Post-Purchase Check-in",
                    schedule: "3 days after purchase",
                  },
                  {
                    name: "Churn Risk Survey",
                    schedule: "Triggered by low usage",
                  },
                ].map((automation) => (
                  <div
                    key={automation.name}
                    className="flex flex-col gap-2 rounded-2xl border border-slate-200 p-4"
                  >
                    <p className="font-medium text-slate-900">
                      {automation.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {automation.schedule}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
