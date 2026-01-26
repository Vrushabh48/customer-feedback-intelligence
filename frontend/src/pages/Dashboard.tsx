import { useCallback, useState } from "react";
import axios from "axios";
import { api } from "../lib/axios";

type TestStatus =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export default function Dashboard() {
  const [status, setStatus] = useState<TestStatus>({ type: "idle" });

  const testProtected = useCallback(async () => {
    setStatus({ type: "loading" });

    try {
      const res = await api.get("/auth/protected");

      setStatus({
        type: "success",
        message:
          typeof res.data === "string"
            ? res.data
            : "Protected API call succeeded.",
      });
    } catch (err: unknown) {
      let message = "Protected API call failed.";

      if (axios.isAxiosError(err)) {
        const apiMessage =
          err.response?.data &&
          typeof err.response.data === "object" &&
          "message" in err.response.data
            ? String(err.response.data.message)
            : null;

        if (apiMessage) {
          message = apiMessage;
        }
      }

      setStatus({ type: "error", message });
    }
  }, []);

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-xl">Dashboard</h1>

      <button
        onClick={testProtected}
        disabled={status.type === "loading"}
        className="bg-black text-white px-4 py-2 disabled:opacity-50"
      >
        {status.type === "loading"
          ? "Calling API..."
          : "Call Protected API"}
      </button>

      {status.type === "success" && (
        <p className="text-green-600 text-sm">{status.message}</p>
      )}

      {status.type === "error" && (
        <p className="text-red-600 text-sm">{status.message}</p>
      )}
    </div>
  );
}