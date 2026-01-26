import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../lib/axios";
import { authStore } from "../lib/authStore";

type LoginStatus =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "error"; message: string };

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<LoginStatus>({ type: "idle" });

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!email || !password) {
        setStatus({
          type: "error",
          message: "Email and password are required.",
        });
        return;
      }

      setStatus({ type: "loading" });

      try {
        const res = await api.post("/auth/login", {
          email,
          password,
        });

        const accessToken = res.data?.accessToken;

        if (!accessToken) {
          throw new Error("Missing access token in response");
        }

        authStore.setToken(accessToken);

        navigate("/dashboard", { replace: true });
      } catch (err: unknown) {
        let message = "Login failed. Please try again.";

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
    [email, password, navigate]
  );

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-96 space-y-4"
        noValidate
      >
        <h1 className="text-xl font-semibold">Login</h1>

        <input
          type="email"
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status.type === "loading"}
          required
        />

        <input
          type="password"
          className="border p-2 w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={status.type === "loading"}
          required
        />

        <button
          type="submit"
          className="bg-black text-white w-full py-2 disabled:opacity-50"
          disabled={status.type === "loading"}
        >
          {status.type === "loading" ? "Logging in..." : "Login"}
        </button>

        {status.type === "error" && (
          <p className="text-red-600 text-sm">{status.message}</p>
        )}
      </form>
    </div>
  );
}
