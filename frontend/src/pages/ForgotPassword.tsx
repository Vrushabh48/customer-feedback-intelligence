import { useCallback, useState } from "react";
import axios from "axios";
import { api } from "../lib/axios";

type ForgotStatus =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<ForgotStatus>({ type: "idle" });

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!email) {
        setStatus({
          type: "error",
          message: "Email is required.",
        });
        return;
      }

      setStatus({ type: "loading" });

      try {
        await api.post("/auth/forgot-password", { email });

        // Always show the same success message (prevent enumeration)
        setStatus({
          type: "success",
          message:
            "If the email exists, a password reset link has been sent.",
        });

        setEmail("");
      } catch (err: unknown) {
        // Even on failure, do NOT reveal whether the email exists
        const message = "If the email exists, a password reset link has been sent.";

        if (axios.isAxiosError(err)) {
          // Optionally log err for monitoring, but do not surface details
        }

        setStatus({ type: "success", message });
      }
    },
    [email]
  );

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-96 space-y-4"
        noValidate
      >
        <h1 className="text-xl">Forgot Password</h1>

        <input
          type="email"
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status.type === "loading"}
          required
        />

        <button
          type="submit"
          className="bg-black text-white w-full py-2 disabled:opacity-50"
          disabled={status.type === "loading"}
        >
          {status.type === "loading"
            ? "Sending..."
            : "Send Reset Link"}
        </button>

        {status.type === "success" && (
          <p className="text-sm text-green-600">{status.message}</p>
        )}

        {status.type === "error" && (
          <p className="text-sm text-red-600">{status.message}</p>
        )}
      </form>
    </div>
  );
}