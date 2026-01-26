import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { api } from "../lib/axios";

type VerificationStatus =
  | { type: "loading" }
  | { type: "success" }
  | { type: "error"; message: string };

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<VerificationStatus>({
    type: "loading",
  });

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      return;
    }

    const verifyEmail = async () => {
      try {
        await api.post("/auth/verify-email", { token });

        if (!isMountedRef.current) return;

        setStatus({ type: "success" });

        // Redirect after a short delay for UX clarity
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1500);
      } catch (err: unknown) {
        if (!isMountedRef.current) return;

        let message = "Email verification failed.";

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
    };

    verifyEmail();
  }, [navigate, params]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {status.type === "loading" && (
        <p className="text-sm">Verifying your email…</p>
      )}

      {status.type === "success" && (
        <p className="text-green-600 text-sm">
          Email verified successfully. Redirecting…
        </p>
      )}

      {status.type === "error" && (
        <p className="text-red-600 text-sm">{status.message}</p>
      )}
    </div>
  );
}
