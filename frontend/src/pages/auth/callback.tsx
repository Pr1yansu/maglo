import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "@/components/loader";
import { useAuth } from "@/hooks/use-auth";

const ERROR_MESSAGES: Record<string, string> = {
  missing_user: "We couldn't complete the sign-in process. Please try again.",
  server_error:
    "Authentication failed due to a server issue. Please try again.",
};

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { completeOAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const errorCode = params.get("error");

    if (errorCode) {
      const message =
        ERROR_MESSAGES[errorCode] ||
        "Authentication was cancelled or failed. Please try again.";
      setError(message);
      const timer = setTimeout(
        () => navigate("/login", { replace: true }),
        3500
      );
      return () => clearTimeout(timer);
    }

    if (!token) {
      setError("Missing sign-in token. Please try signing in again.");
      const timer = setTimeout(
        () => navigate("/login", { replace: true }),
        3500
      );
      return () => clearTimeout(timer);
    }

    let active = true;

    const finalize = async () => {
      try {
        await completeOAuth(token);
        if (active) {
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        if (!active) return;
        const message =
          err instanceof Error
            ? err.message
            : "We couldn't verify your account. Please try again.";
        setError(message);
        setTimeout(() => navigate("/login", { replace: true }), 3500);
      }
    };

    finalize();

    return () => {
      active = false;
    };
  }, [location.search, completeOAuth, navigate]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-xl font-semibold">Authentication Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </main>
    );
  }

  return <Loader />;
};

export default AuthCallback;
