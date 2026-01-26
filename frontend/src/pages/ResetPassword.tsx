import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { api } from "../lib/axios";

type ResetStatus =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<ResetStatus>({ type: "idle" });

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!token) {
        setStatus({
          type: "error",
          message: "Invalid or missing reset token.",
        });
        return;
      }

      if (!password) {
        setStatus({
          type: "error",
          message: "Password is required.",
        });
        return;
      }

      if (password.length < 8) {
        setStatus({
          type: "error",
          message: "Password must be at least 8 characters.",
        });
        return;
      }

      setStatus({ type: "loading" });

      try {
        await api.post("/auth/reset-password", {
          token,
          password,
        });

        setStatus({
          type: "success",
          message: "Password updated successfully.",
        });

        setPassword("");
      } catch (err: unknown) {
        let message = "Failed to reset password. Please try again.";

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
    },
    [password, token]
  );

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-96 space-y-4"
        noValidate
      >
        <h1 className="text-xl">Reset Password</h1>

        <input
          type="password"
          className="border p-2 w-full"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={status.type === "loading"}
          required
          minLength={8}
        />

        <button
          type="submit"
          className="bg-black text-white w-full py-2 disabled:opacity-50"
          disabled={status.type === "loading"}
        >
          {status.type === "loading" ? "Updating..." : "Reset Password"}
        </button>

        {status.type === "success" && (
          <p className="text-green-600 text-sm">{status.message}</p>
        )}

        {status.type === "error" && (
          <p className="text-red-600 text-sm">{status.message}</p>
        )}
      </form>
    </div>
  );
}