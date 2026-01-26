import { useCallback, useRef, useState } from "react";
import axios from "axios";
import { api } from "../lib/axios";

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>({ type: "idle" });

  // Prevent state updates after unmount
  const isMountedRef = useRef(true);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!email || !password) {
        setStatus({
          type: "error",
          message: "Email and password are required",
        });
        return;
      }

      if (password.length < 8) {
        setStatus({
          type: "error",
          message: "Password must be at least 8 characters",
        });
        return;
      }

      setStatus({ type: "loading" });

      try {
        await api.post("/auth/signup", { email, password });

        if (!isMountedRef.current) return;

        setStatus({
          type: "success",
          message: "Please check your email for the verification link.",
        });

        // Optional: reset form after success
        setEmail("");
        setPassword("");
      } catch (err: unknown) {
        if (!isMountedRef.current) return;

        let message = "Signup failed. Please try again.";

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
    [email, password]
  );

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-96 space-y-4"
        noValidate
      >
        <h1 className="text-xl font-semibold">Sign Up</h1>

        <input
          className="border p-2 w-full"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status.type === "loading"}
          required
        />

        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
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
          {status.type === "loading" ? "Signing up..." : "Sign Up"}
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
